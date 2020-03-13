<template>
  <v-container>
    <!-- loader section -->
    <div v-if="showLoader" class="text-center">
      <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
    </div>
    <!-- loader section end -->
    <!-- show table-section -->
    <div v-if="showTable">
      <v-card-title>
        <v-text-field v-model="search" label="Search" single-line hide-details></v-text-field>
        <div class="flex-grow-1"></div>
        <download-csv :data="tableData">
          <v-hover>
            <template v-slot="{ hover }">
              <v-btn text fab small :elevation="hover ? 4 : 0">
                <v-icon color="green" size="25">mdi-download</v-icon>
              </v-btn>
            </template>
          </v-hover>
        </download-csv>
      </v-card-title>
      <v-data-table :headers="headers" :items="tableData" :search="search"></v-data-table>
    </div>
    <!-- show table section-end -->
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { Component, Prop, Watch } from "vue-property-decorator";
//@ts-ignore
import JsonCSV from "vue-json-csv";

@Component
export default class DataTable extends Vue {
  // @ts-ignore
  @Prop() myProps;
  // Datatable Section
  search = "";
  headers = [];
  tableData = [];
  showLoader = false;
  showTable = false;

  @Watch("myProps", { deep: true })
  async myPropsChanged(val: any, oldVal: string) {
    console.log("data table props-lifecycle");
    this.showLoader = true;
    this.showTable = false;

    let res = await this.dataFunction(this.myProps);
    console.log(res);
    let header: any = [{ text: "Time Stamp", value: "Time Stamp" }];
    // console.log(res["column name"])
    for (let item of res["column name"]) {
      header.push({ text: item, value: item });
    }
    this.headers = header;
    this.tableData = res["data"];
    this.showLoader = false;
    this.showTable = true;
  }

  // created lifecycle hook
  async created() {
    console.log("data table created-lifecycle");
    this.showLoader = true;
    this.showTable = false;

    let res = await this.dataFunction(this.myProps);
    console.log(res);
    let header: any = [{ text: "Time Stamp", value: "Time Stamp" }];
    // console.log(res["column name"])
    for (let item of res["column name"]) {
      header.push({ text: item, value: item });
    }
    this.headers = header;
    this.tableData = res["data"];
    this.showLoader = false;
    this.showTable = true;
  }

  // dataFunction(dataPair: any) in use for call api of quicktime & customTime in a single function
  // @recieve the (myProps data)

  async dataFunction(dataPair: any) {
    if (dataPair.quickTime) {
      console.log("work for quick time");
      let startTime: any;
      let getUnitStr = dataPair.quickTime.split("");
      let unit = getUnitStr[getUnitStr.length - 1];
      getUnitStr.pop();
      let time = getUnitStr.join("");
      if (unit === "m") {
        startTime = new Date(Date.now() - 60000 * parseInt(time));
      }
      if (unit === "h") {
        startTime = new Date(Date.now() - 1000 * 3600 * parseInt(time));
      }
      if (unit === "d") {
        startTime = new Date(Date.now() - 1000 * 3600 * 24 * parseInt(time));
      }

      const apiStartTime = Math.floor(startTime.getTime());
      // console.log("Start Time :"+apiStartTime);
      const date = new Date();
      const apiEndTime = Math.floor(date.getTime());
      // console.log("End Time : "+apiEndTime);
      let data = {
        "Machine name": dataPair.machine,
        "Stat name": dataPair.stat,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Time format": dataPair.timeZone
      };
      console.log(data);
      // @ts-ignore
      let responseData = await axios.post(
        this.$store.state.baseUrl+":3443/api/analytics/data_table/123-567-8910",
        data
      );
      return responseData.data;
    } else {
      console.log("work for customize time");
      const dateStart = new Date(
        dataPair.fromDate + " " + dataPair.fromHourMinutes
      );
      const apiStartTime = Math.floor(dateStart.getTime());
      const endStart = new Date(dataPair.toDate + " " + dataPair.toHourMinutes);
      const apiEndTime = Math.floor(endStart.getTime());
      let data = {
        "Machine name": dataPair.machine,
        "Stat name": dataPair.stat,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Time format": dataPair.timeZone
      };
      console.log(data);
      // @ts-ignore
      let responseData = await axios.post(
        this.$store.state.baseUrl+":3443/api/analytics/data_table/123-567-8910",
        data
      );
      return responseData.data;
    }
  }
}
</script>
