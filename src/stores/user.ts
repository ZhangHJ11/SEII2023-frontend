import { defineStore } from "pinia";
import { request } from "~/utils/request";

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            username: '',
            name: '',
            type: '',
            idn: '',
            phone: '',
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
                const userType = res.data.data.id_type;
                this.idn = res.data.data.idn;
                this.phone = res.data.data.phone;
                this.points = res.data.data.points;
                if(userType === 0){
                    this.type = "身份证";
                }
                else if(userType === 1){
                    this.type = "护照";
                }
                else{
                    this.type = "其他";
                }

            }).catch((err) => {
                console.log(err)
            })
        }
    }

})