<script setup lang="ts">
import { SwitchFilled } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { h, reactive, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import { useStationsStore } from "~/stores/stations";
import { RouteInfo, TicketInfo } from '~/utils/interfaces';
import { request } from "~/utils/request";

const props = defineProps({
  name: String,
  route_id: Number,
  date: String,
  departure_times: Array,
  arrival_times: Array,
  extra_infos: Array,
  ticket_infos: Array,
  train_type: String,
  business_seat_price: Number,
  first_class_seat_price: Number,
  second_class_seat_price: Number,
  business_seat_num: Number,
  first_class_seat_num: Number,
  second_class_seat_num: Number,
  soft_seat_price: Number,
  hard_seat_price: Number,
  soft_sleep_price: Number,
  hard_sleep_price: Number,
  soft_seat_num: Number,
  hard_seat_num: Number,
  soft_sleep_num: Number,
  hard_sleep_num: Number,
})


const router = useRouter()
const stations = useStationsStore()

let train = reactive({
  name: props.name,
  train_type: props.train_type,
  route_id: props.route_id,
  date: props.date,
  departure_times: props.departure_times as Array<string>,
  arrival_times: props.arrival_times as Array<string>,
  extra_infos: props.extra_infos as Array<string>,
  ticket_infos: props.ticket_infos as Array<TicketInfo>,
  business_seat_price: props.business_seat_price,
  first_class_seat_price: props.first_class_seat_price,
  second_class_seat_price: props.second_class_seat_price,
  business_seat_num: props.business_seat_num,
  first_class_seat_num: props.first_class_seat_num,
  second_class_seat_num: props.second_class_seat_num,
  soft_seat_price: props.soft_seat_price,
  hard_seat_price: props.hard_seat_price,
  soft_sleep_price: props.soft_sleep_price,
  hard_sleep_price: props.hard_sleep_price,
  soft_seat_num: props.soft_seat_num,
  hard_seat_num: props.hard_seat_num,
  soft_sleep_num: props.soft_sleep_num,
  hard_sleep_num: props.hard_sleep_num,
})

if (train.ticket_infos.length === 0) train.ticket_infos = new Array<TicketInfo>(4).fill({ count: 0, price: 0, type: "" })
console.log(train.ticket_infos)
// if (train.train_type === "高铁") {
//   train.ticket_infos = [{
//     count: train.business_seat_num === undefined ? 0 : train.business_seat_num,
//     price: train.business_seat_price === undefined ? 0 : train.business_seat_price,
//     type: "商务座"
//   }, {
//     count: train.first_class_seat_num === undefined ? 0 : train.first_class_seat_num,
//     price: train.first_class_seat_price === undefined ? 0 : train.first_class_seat_price,
//     type: "一等座"
//   }, {
//     count: train.second_class_seat_num === undefined ? 0 : train.second_class_seat_num,
//     price: train.second_class_seat_price === undefined ? 0 : train.second_class_seat_price,
//     type: "二等座"
//   }]
// } else if (train.train_type === "普通列车") {
//   train.ticket_infos = [{
//     count: train.soft_sleep_num === undefined ? 0 : train.soft_sleep_num,
//     price: train.soft_sleep_price === undefined ? 0 : train.soft_sleep_price,
//     type: "软卧"
//   }, {
//     count: train.hard_sleep_num === undefined ? 0 : train.hard_sleep_num,
//     price: train.hard_sleep_price === undefined ? 0 : train.hard_sleep_price,
//     type: "硬卧"
//   }, {
//     count: train.soft_seat_num === undefined ? 0 : train.soft_seat_num,
//     price: train.soft_sleep_price === undefined ? 0 : train.soft_sleep_price,
//     type: "软座"
//   }, {
//     count: train.hard_seat_num === undefined ? 0 : train.hard_seat_num,
//     price: train.hard_seat_price === undefined ? 0 : train.hard_seat_price,
//     type: "硬座"
//   }]
// }

let placeholderText = ['qing ']

let route = reactive({
  id: 0,
  name: '',
  station_ids: []
})
let routes = ref([] as RouteInfo[])

const getRoutes = () => {
  request({
    url: `/admin/route`,
    method: 'GET'
  }).then((res) => {
    routes.value = res.data.data
  }).catch((error) => {
    if (error.response?.data.code == 100003) {
      router.push('/login')
    }
    ElNotification({
      offset: 70,
      title: 'getRoutes错误(trainManage)',
      message: h('error', { style: 'color: teal' }, error.response?.data.msg),
    })
    console.log(error)
  })
  console.log("end")
}

getRoutes()

const getRoute = () => {
  if (train.route_id === undefined) return
  request({
    url: `/admin/route/${train.route_id}`,
    method: 'GET'
  }).then((res) => {
    route.id = res.data.data.id
    route.name = res.data.data.name
    route.station_ids = res.data.data.station_ids
  }).catch((error) => {
    if (error.response?.data.code == 100003) {
      router.push('/login')
    }
    ElNotification({
      offset: 70,
      title: 'getRoute错误(trainManage)',
      message: h('error', { style: 'color: teal' }, error.response?.data.msg),
    })
    console.log(error)
  })
}

watch(() => train.route_id, () => {
  train.departure_times = []
  train.arrival_times = []
  train.extra_infos = []
  getRoute()
})
getRoute()

function updateTicketPrice(value: number, id: number) {
  // value是价格，id是数组的下表
  train.ticket_infos[id].price = value;
  console.log(train.ticket_infos[id].price);
}

function updateTicketNumber(value: number, id: number) {
  // value是数量，id是数组的下表
  train.ticket_infos[id].count = value;
  console.log(train.ticket_infos[id].count);
}

</script>

<template>
  <div>
    <el-row>
      <el-col :span="7">
        <el-form-item>
          <template #label>
            <el-text tag="b" type="primary">
              车次名
            </el-text>
          </template>
          <el-input v-model="train.name" />
        </el-form-item>
      </el-col>
      <el-col :span="7" :offset="1">
        <el-form-item style="display: flex">
          <template #label>
            <el-text tag="b" type="primary">
              车型
            </el-text>
          </template>
          <el-select v-model="train.train_type" style="display: flex; flex-grow: 1">
            <el-option v-for="type in ['高铁', '普通列车']" :key="type" :label="type" :value="type" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="1">
        <el-form-item style="display: flex">
          <template #label>
            <el-text tag="b" type="primary">
              日期
            </el-text>
          </template>
          <el-date-picker v-model="train.date" value-format="YYYY-MM-DD" :clearable="false"
            style="display: flex; flex-grow: 1" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="7">
        <el-form-item>
          <template #label>
            <el-text tag="b" type="primary">
              路线名
            </el-text>
          </template>
          <el-select v-model="train.route_id" style="width: 100%">
            <el-option v-for="singleRoute in routes" :key="singleRoute.id" :label="singleRoute.name"
              :value="singleRoute.id" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="7" :offset="0">
        <el-form-item style="display: flex">
          <template #label>
            <el-text tag="b" type="primary">
              两站间价格
            </el-text>
          </template>
          <template v-if="train.train_type === '高铁'">
            <!--                      <el-input v-model="train.ticket_infos[0].price" placeholder="商务座价格"/>-->
            <el-input v-model="train.business_seat_price"
              @change="updateTicketPrice(<number>train.business_seat_price, 0)" placeholder="商务座价格" />
            <el-input v-model="train.first_class_seat_price"
              @change="updateTicketPrice(<number>train.first_class_seat_price, 1)" placeholder="一等座价格" />
            <el-input v-model="train.second_class_seat_price"
              @change="updateTicketPrice(<number>train.second_class_seat_price, 2)" placeholder="二等座价格" />
          </template>
          <template v-else-if="train.train_type === '普通列车'">
            <el-input v-model="train.soft_sleep_price" @change="updateTicketPrice(<number>train.soft_sleep_price, 0)"
              placeholder="软卧价格" />
            <el-input v-model="train.hard_sleep_price" @change="updateTicketPrice(<number>train.hard_sleep_price, 1)"
              placeholder="硬卧价格" />
            <el-input v-model="train.soft_seat_price" @change="updateTicketPrice(<number>train.soft_seat_price, 2)"
              placeholder="软座价格" />
            <el-input v-model="train.hard_seat_price" @change="updateTicketPrice(<number>train.hard_seat_price, 3)"
              placeholder="硬座价格" />
          </template>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="7" :offset="0">
        <el-form-item style="display: flex">
          <template #label>
            <el-text tag="b" type="primary">
              座位数量
            </el-text>
          </template>
          <!-- Display different input fields based on the selected train_type -->
          <template v-if="train.train_type === '高铁'">
            <el-input v-model="train.business_seat_num" @change="updateTicketNumber(<number>train.business_seat_num, 0)"
              placeholder="商务座数量" />
            <el-input v-model="train.first_class_seat_num"
              @change="updateTicketNumber(<number>train.first_class_seat_num, 1)" placeholder="一等座数量" />
            <el-input v-model="train.second_class_seat_num"
              @change="updateTicketNumber(<number>train.second_class_seat_num, 2)" placeholder="二等座数量" />
          </template>
          <template v-else-if="train.train_type === '普通列车'">
            <el-input v-model="train.soft_sleep_num" @change="updateTicketNumber(<number>train.soft_sleep_num, 0)"
              placeholder="软卧数量" />
            <el-input v-model="train.hard_sleep_num" @change="updateTicketNumber(<number>train.hard_sleep_num, 1)"
              placeholder="硬卧数量" />
            <el-input v-model="train.soft_seat_num" @change="updateTicketNumber(<number>train.soft_seat_num, 2)"
              placeholder="软座数量" />
            <el-input v-model="train.hard_seat_num" @change="updateTicketNumber(<number>train.hard_seat_num, 3)"
              placeholder="硬座数量" />
          </template>
        </el-form-item>
      </el-col>
    </el-row>


    <div v-for="(station, index) in route.station_ids" :key="station">
      <el-card style="margin-bottom: 0.25%" shadow="hover" class="container">
        <div style="display: flex; align-items: center;">
          <el-icon class="handle" size="large">
            <SwitchFilled />
          </el-icon>
          <strong style="margin-left: 5%; margin-right: 5%">
            {{ index + 1 }}
          </strong>
          <div style="width: 80%">
            {{ stations.idToName[station] }}
          </div>

          <el-date-picker style="width: 50%; margin-right: 1%" :disabled="index === 0"
            @change="() => { if (index === route.station_ids.length - 1) { train.departure_times[index] = train.arrival_times[index] } }"
            v-model="train.arrival_times[index]" type="datetime" placeholder="到点" format="YY/MM/DD HH:mm" />

          <el-date-picker style="width: 50%" :disabled="index === route.station_ids.length - 1"
            @change="() => { if (index === 0) { train.arrival_times[0] = train.departure_times[0] } }"
            v-model="train.departure_times[index]" type="datetime" placeholder="开点" format="YY/MM/DD HH:mm" />
        </div>
      </el-card>
    </div>

    <el-button @click="$emit('formSubmitted', train)" style="margin-top: 2vh" type="primary">
      确认
    </el-button>


    <!--        <pre>-->
    <!--          {{ train.arrival_times }}-->
    <!--          {{train.departure_times }}-->
    <!--        </pre>-->
  </div>
</template>

<style scoped>
.change {
  visibility: hidden
}

.container:hover .change {
  visibility: visible
}
</style>
