import { defineStore } from "pinia";
import { request } from "~/utils/request";

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            username: '',
            name: '',
            id_type: '',
            idn: '',
            phone: '',
            admin: '',
            points: 0,
        }
    },
    getters: {
        getUserName() {

        }
    },
    actions: {
        fetch() {
            request({
                url: '/user',
                method: 'GET'
            }).then((res) => {
                this.username = res.data.data.username;
                this.name = res.data.data.name;
                if (res.data.data.id_type === 0) {
                    this.id_type = "身份证";
                } else if (res.data.data.id_type === 1) {
                    this.id_type = "护照";
                } else {
                    this.id_type = "其它";
                }
                this.idn = res.data.data.idn;
                this.phone = res.data.data.phone;
                if (res.data.data.admin) {
                    this.admin = "管理员";
                } else {
                    this.admin = "用户";
                }
                this.points = res.data.data.points;
            }).catch((err) => {
                console.log(err)
            })
        }
    }

})