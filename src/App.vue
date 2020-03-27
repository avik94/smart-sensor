<template>
  <v-app>
    <v-navigation-drawer app dark class="blue-grey darken-3" v-model="drawer" :width="230">
      <div class="text-center headerSidebar">
        <v-img
        class="sidebarHeader"
          src="./assets/msense.png"
          alt
        ></v-img>
      </div>
      <v-list height="5" shaped dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.url" color="white" @click = "clickMachineItem(item.title, item.id)">
          <v-list-item-icon>
            <v-icon v-bind:style="{ color: item.status  }">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content style="font-size: 13px">
            {{ item.title }}            
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark class="amber darken-3" height="50" elevation="3">
      <v-app-bar-nav-icon @click="drawerClick()"></v-app-bar-nav-icon>
      <h3 style="padding-left:30px;color: #ffffff;">Smart Sensors</h3>
      <v-spacer></v-spacer>
      <p style="padding-top:10px;font-size:10px;">Version 1.0</p>
    </v-app-bar>

    <v-content class="contentBackground" ref="dashboard" id="dasboard">
      <router-view v-bind:clickBar="sidebarSize" />
    </v-content>
  </v-app>
</template>

<style lang="scss">
.headerSidebar {
  background: #263238;
  padding: 42px 13px;
}
.contentBackground{
  background: #e6edf0;
}
</style>
<script lang="ts">
import Vue from "vue";
import axios from "axios";

import {Component} from "vue-property-decorator"
@Component
export default class App extends Vue {
  drawer:any = null;
  sidebarSize = "";
  items:any =  [];
  drawerClick(){
    this.drawer = !this.drawer;
    // console.log(this.$refs.dashboard.$refs.content.offsetWidth)
    // @ts-ignore 230px 0px
    // console.log(this.$refs.dashboard.styles.paddingLeft);
    this.sidebarSize = this.$refs.dashboard.styles.paddingLeft;

  }

  async created(){
    console.log(this.$route.params.companyId);
    localStorage.removeItem("companyName");
    localStorage.setItem("companyName", this.$route.params.companyId)
    let x = await axios.post('https://crystalball-powerviz.machinesense.com:3443/api/analytics/get_machine/123-567-8910',
    {
	    "Company name": this.$route.params.companyId
    });
    console.log(x.data);
    let machineList:any = [];
    x.data.machine_list.forEach((i:any, indexMachine:any)=>{
      console.log(i)
      i.forEach((item:any, index:any)=>{
        console.log(item)
        machineList.push({ title: item, icon: "mdi-adjust", url: "/machine-data/"+ index, status: 'green'});
      });
    });
    this.items = machineList
    // console.log(machineList)
  }

  clickMachineItem(name:any, id:any) {
    localStorage.removeItem('machineName');
    // localStorage.removeItem('machineId');
    localStorage.setItem('machineName', name);
    // localStorage.setItem('machineId', id);
  }
}
</script>
