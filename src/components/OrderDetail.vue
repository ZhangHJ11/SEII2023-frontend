<script setup lang="ts">

import { request } from "~/utils/request";
import { ElNotification } from "element-plus";
import { h, onMounted, reactive, watch} from "vue";
import { useStationsStore } from "~/stores/stations";
import { parseDate } from "~/utils/date";
import { useRouter } from "vue-router";
import { OrderDetailData } from "~/utils/interfaces";
import axios from "axios";
import {useUserStore} from "~/stores/user";

const router = useRouter()
const stations = useStationsStore()
const user = useUserStore()

const props = defineProps({
    id: Number,
    type : Number,
})

let orderDetail = reactive<{ data: OrderDetailData }>({
    data: {
        id: 0,
        train_id: 0,
        seat: '',
        status: '',
        created_at: '',
        start_station_id: 0,
        end_station_id: 0,
        departure_time: '',
        arrival_time: '',
        money: 0,
        seat_type: '',
    },

})

let train = reactive<{ data: { name?: string } }>({
    data: {}
});

const getOrderDetail = () => {
    request({
        url: `/order/${props.id}`,
        method: 'GET',
    }).then(res => {
        orderDetail.data = res.data.data
        console.log(orderDetail.data)
    }).catch(err => {
        console.log(err)
        if (err.response?.data.code == 100003) {
            router.push('/login')
        }
        ElNotification({
            offset: 70,
            title: 'getOrder错误',
            message: h('i', { style: 'color: teal' }, err.response?.data.msg),
        })
    })
}

const getTrain = () => {
    console.log("getTrain")
    if (orderDetail.data) {
        request({
            url: `/train/${orderDetail.data.train_id}`,
            method: 'GET'
        }).then((res) => {
            train.data = res.data.data
            console.log(train)
        }).catch((error) => {
            ElNotification({
                offset: 70,
                title: 'getTrain错误(orderDetail)',
                message: h('error', { style: 'color: teal' }, error.response?.data.msg),
            })
            console.log(error)
        })
    }
}


const pay = (id: number,payType: number) => {
    console.log(payType);
    request({
        url: `/order/${id}`,
        method: 'PATCH',
        data: {
            status: '已支付',
            payType: payType, //支付类型
        }
    }).then((res) => {
        ElNotification({
            offset: 70,
            title: '支付成功',
            message: h('success', { style: 'color: teal' }, res.data.msg),
        })
        getOrderDetail()
        // TODO：在pay中跳转，只要改一下顺序这里就不会先显示完成，再跳转支付宝
        console.log("---from patchOrder---")
        console.log(res)
        console.log(res.data.data)
        window.location.href=res.data.data;
    }).catch((error) => {
        if (error.response?.data.code == 100003) {
            router.push('/login')
        }
        ElNotification({
            offset: 70,
            title: '支付失败',
            message: h('error', { style: 'color: teal' }, error.response?.data.msg),
        })
        console.log(error)
    })
}

const payWithPoints = (id: number,payType: number) => {
    console.log("points" + payType);
    const pointsNeeded = orderDetail.data.money * 10;
    if(user.points < pointsNeeded){
        //积分不足
        ElNotification({
            offset: 70,
            title: '积分不足',
            message: h('error', {style: 'color: teal'}, '您的积分不足，无法进行积分支付。'),
        });
        return;
    }
    request({
        url: `/order/${id}`,
        method: 'PATCH',
        data: {
            status: '已支付',
            payType: payType,
        },
    })
        .then((res) => {
        ElNotification({
            offset: 70,
            title: '支付成功',
            message: h('success', {style: 'color:teal'},res.data.msg),
        });
            getOrderDetail();
            // 扣除积分
            // user.points = (user.points - pointsNeeded);
        })
        .catch((error) => {
            if (error.response?.data.code == 100003) {
                router.push('/login');
            }
            ElNotification({
                offset: 70,
                title: '支付失败',
                message: h('error', { style: 'color: teal' }, error.response?.data.msg),
            });
            console.log(error);
        });
};

const cancel = (id: number) => {
    request({
        url: `/order/${id}`,
        method: 'PATCH',
        data: {
            status: '已取消',
            payType: 0
        }
    }).then((res) => {
        ElNotification({
            offset: 70,
            title: '取消成功',
            message: h('success', { style: 'color: teal' }, res.data.msg),
        })
        getOrderDetail()
        console.log(res)
    }).catch((error) => {
        if (error.response?.data.code == 100003) {
            router.push('/login')
        }
        ElNotification({
            offset: 70,
            title: '取消失败',
            message: h('error', { style: 'color: teal' }, error.response?.data.msg),
        })
        console.log(error)
    })
}

const generateOrder = () => {
    let url;
    axios.post("http://localhost:8080/api/do-post-test") // 向后端发送请求，获取支付页面的 URL
        .then((response) => {
            url = response.data;
            console.log(url);
            window.location.href=url;
        }).catch((error) => {
        console.log("errorOrderPath");
        // 处理请求失败的情况
    });
};

watch(orderDetail, () => {
    getTrain()
})

onMounted(() => {
    stations.fetch()
    getOrderDetail()
})

getOrderDetail()
</script>

<template>
    <div style="display: flex; flex-direction: column">

        <div style="margin-bottom: 2vh;">
            <el-button style="float:right" @click="getOrderDetail">
                刷新
            </el-button>
        </div>

        <div style="display: flex; justify-content: space-between;">
            <div>
                <el-text size="large" tag="b" type="primary">
                    订单号:&nbsp;&nbsp;
                </el-text>
                <el-text size="large" tag="b">
                    {{ props.id }}
                </el-text>
            </div>
            <div>
                <el-text size="large" tag="b" type="primary">
                    创建日期:&nbsp;&nbsp;
                </el-text>
                <el-text size="large" tag="b" v-if="orderDetail.data">
                    {{ parseDate(orderDetail.data.created_at) }}
                </el-text>
            </div>
        </div>

        <div>
            <el-text size="large" tag="b" type="primary">
                订单状态:&nbsp;&nbsp;
            </el-text>
            <el-text size="large" tag="b" v-if="orderDetail.data">
                {{ orderDetail.data.status }}
            </el-text>
        </div>
        <div style="margin-bottom: 2vh">
            <el-text size="large" tag="b" type="primary">
                车次信息:
            </el-text>
        </div>

        <el-descriptions :column="4" border>
            <el-descriptions-item :span="2" width="25%" align="center">
                <template #label>
                    <el-text type="primary" tag="b" size="large">
                        车次
                    </el-text>
                </template>
                <el-text type="primary" tag="b" size="large">
                    {{ train?.data?.name }}
                </el-text>
            </el-descriptions-item>
            <el-descriptions-item label="席位信息" :span="2" width="25%" align="center" v-if="orderDetail.data">
                {{ orderDetail.data.seat }}
            </el-descriptions-item>
            <el-descriptions-item label="座位类型" :span="2" width="25%" align="center" v-if="orderDetail.data">
                {{ orderDetail.data.seat_type }}
            </el-descriptions-item>
            <el-descriptions-item label="价格" :span="2" width="25%" align="center" v-if="orderDetail.data">
                {{ orderDetail.data.money }}
            </el-descriptions-item>
            <el-descriptions-item label="出发站" :span="2" width="25%" align="center" v-if="orderDetail.data">
                {{ stations.idToName[orderDetail.data.start_station_id] ?? '未知站点' }}
            </el-descriptions-item>
            <el-descriptions-item label="到达站" :span="2" width="25%" align="center" v-if="orderDetail.data">
                {{ stations.idToName[orderDetail.data.end_station_id] ?? '未知站点' }}
            </el-descriptions-item>
            <el-descriptions-item label="出发时间" :span="2" width="25%" align="center" v-if="orderDetail.data">
                {{ parseDate(orderDetail.data.departure_time) }}
            </el-descriptions-item>
            <el-descriptions-item label="到达时间" :span="2" width="25%" align="center" v-if="orderDetail.data">
                {{ parseDate(orderDetail.data.arrival_time) }}
            </el-descriptions-item>
        </el-descriptions>

        <div style="margin-top: 2vh" v-if="orderDetail.data && orderDetail.data.status === '等待支付'">
            <div style="float:right;">
                <el-button type="danger" @click="cancel(id ?? -1)">
                    取消订单
                </el-button>
                <el-button type="primary" @click="pay(id ?? -1,1)">
                    直接支付
                </el-button>
                <el-button type="primary" @click="payWithPoints(id ?? -1,2)">
                    积分支付
                </el-button>
            </div>
        </div>
        <div v-else-if="orderDetail.data && orderDetail.data.status === '已支付'" style="margin-top: 2vh">
            <div style="float:right;">
                <el-button @click="cancel(id ?? -1)">
                    取消订单
                </el-button>
            </div>
        </div>

    </div>
</template>

<style scoped></style>