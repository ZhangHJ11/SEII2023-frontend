import { defineStore } from "pinia";
import { request } from "~/utils/request";

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            username: '',
            name: '',
            idType: '',
            idn: '',
            phone: '',
            isAdmin: '',
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
                    this.idType = "身份证";
                } else if (res.data.data.id_type === 1) {
                    this.idType = "护照";
                } else {
                    this.idType = "其它";
                }
                this.idn = res.data.data.idn;
                this.phone = res.data.data.phone;
                console.log("11111111111111111111111111111111111111111111111111111111111111111");
                console.log(res.data.data.is_admin);
                if (res.data.data.is_admin != 0) {
                    this.isAdmin = "管理员";
                } else {
                    this.isAdmin = "用户";
                }
                this.points = res.data.data.points;
                if (userType === 0) {
                    this.type = "身份证";
                }
                else if (userType === 1) {
                    this.type = "护照";
                }
                else {
                    this.type = "其他";
                }

            }).catch((err) => {
                console.log(err)
            })
        }
    }

})