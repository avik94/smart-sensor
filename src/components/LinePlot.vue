<template>
  <v-container>
    <!-- loader div -->
    <div class="text-center" v-if="loader">
      <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
    </div>
    <div v-if="noData">
      <p>No Data Found</p>
    </div>
    <!-- view div -->
    <div v-if="view">
      <!-- <p>{{myProps}}</p> -->
      <div style="border: 1px solid green;">
        <!-- <vue-plotly :data="linedata.data" :layout="linedata.layout" :options="linedata.options" /> -->
        <div id="plotLine"></div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
//@ts-ignore
// import VuePlotly from "@statnett/vue-plotly";
import Plotly from 'plotly.js-dist';
import { Component, Prop, Watch } from "vue-property-decorator";
@Component({
  // components: {
  //   VuePlotly
  // }
})
export default class LinePlot extends Vue {
  // @ts-ignore
  @Prop() myProps;

  // @ts-ignore;
  @Prop() barClick;

  @Watch("barClick",  { deep: true })
  barClickValue(){
    console.log(this.barClick);
    if(this.barClick === 0){
      this.linedata.layout.width = window.innerWidth-320;
      console.log(window.innerWidth)
    }else{
      this.linedata.layout.width = window.innerWidth-220;
      console.log(window.innerWidth)
    }
    console.log(this.linedata.layout)
    Plotly.newPlot('plotLine', this.linedata.data, this.linedata.layout, this.linedata.options);
  }

  @Watch("myProps", { deep: true })
  async myPropsChanged() {
    if(this.barClick){
      if(this.barClick === 0){
        this.linedata.layout.width = window.innerWidth-320;
      }else{
        this.linedata.layout.width = window.innerWidth-220;
      }
    }else{
      this.linedata.layout.width = window.innerWidth-320;
    }
    console.log("coming to props");
    this.view = false;
    this.noData = false;
    this.loader = true;
    this.linedata.data = [];
    await this.preocessData();
    let dummy = []
    let xDummy = []
    for(let i of this.linedata.data[0].x){
      dummy.push("");
      xDummy.push(i)
    }
    this.linedata.data.push({
      x: xDummy,
      y: dummy,
      type: "line",
      showlegend: false,
      name: "test"
    })
    // console.log(this.linedata.data);
    // console.log(this.linedata.data[3]);
    // let x = this.linedata.layout
    Plotly.react('plotLine', this.linedata.data,this.linedata.layout, this.linedata.options);
  }

  linedata:any = {
    data: [
      
    ],
    layout: {
      autosize: false,
      width: 1010,
      height: 450,
      title: {
        text: "Plot Title",
        font: {
          family: "Courier New, monospace",
          size: 17,
          align: 'center'
        },
        xref: "paper",
        x: 0.05
      },
      yaxis: {
        automargin: true,
        tickangle: 30,
        title: {
          text: "Y Axis",
          standoff: 40,
          font: {
            family: "Courier New, monospace",
            size: 1,
            color: "#7f7f7f"
          }
        }
      }
    },
    options: {}
  };
  // line-plot end

  view = false;
  noData = false;
  loader = true;

  async mounted() {
    if(this.barClick){
      if(this.barClick === 0){
        this.linedata.layout.width = window.innerWidth-320;
      }else{
        this.linedata.layout.width = window.innerWidth-220;
      }
    }else{
      this.linedata.layout.width = window.innerWidth-320;
    }
    console.log("coming to created");
    await this.preocessData();
    let dummy = []
    let xDummy = []
    for(let i of this.linedata.data[0].x){
      dummy.push("");
      xDummy.push(i)
    }
    this.linedata.data.push({
      x: xDummy,
      y: dummy,
      type: "line",
      showlegend: false,
      name: "test"
    })
    console.log(this.linedata.data);
    Plotly.newPlot('plotLine', this.linedata.data, this.linedata.layout, this.linedata.options);
    
  }

  async preocessData(){
    if (this.myProps.quickTime) {
      console.log("work for quick time");
      let startTime: any;
      let getUnitStr = this.myProps.quickTime.split("");
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
        "Company name": this.myProps.company,
        "Machine name": this.myProps.machine,
        "Sensor name": this.myProps.stat,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Time format": this.myProps.timeZone
      };
      console.log(data);
      // @ts-ignore
      let responseData = await axios.post(
        this.$store.state.baseUrl+":3443/api/analytics/smart_sensor_plot_data_vrf/123-567-8910",
        data
      );
      // console.log(responseData.data["Line Plot"])
      // console.log(responseData.data["Line PLot"]["Stat"]);
      // work for no data found
      if (responseData.data["Line Plot"] === "No Data Found") {
        this.noData = true;
        this.loader = false;
        this.view = false;
      } else {
        this.linedata.layout.title.text = responseData.data["Line PLot"].Title[0];
        this.linedata.layout.yaxis.title = responseData.data["Line PLot"].Unit[0];
        responseData.data["Line PLot"]["Stat"].forEach((itemStat:any,indexStat:any)=>{
          let xAxis:any = [];
          let yAxis:any = [];
          responseData.data["Line PLot"]["Value"].forEach((item:any, index:any)=>{
            xAxis.push(item[0])
            yAxis.push(item[indexStat+1])
          })
          const data:any = {
            x: xAxis,
            y: yAxis,
            type: "line",
            showlegend: true,
            name: itemStat,
          }
          this.linedata.data.push(data);
        });
        this.view = true;
        this.loader = false;
        this.noData = false;
      }

      // no data found end
    } else {
      console.log("work for customize time");
      const dateStart = new Date(
        this.myProps.fromDate + " " + this.myProps.fromHourMinutes
      );
      const apiStartTime = Math.floor(dateStart.getTime());
      const endStart = new Date(
        this.myProps.toDate + " " + this.myProps.toHourMinutes
      );
      const apiEndTime = Math.floor(endStart.getTime());
      let data = {
      "Company name": this.myProps.company,
      "Machine name": this.myProps.machine,
      "Sensor name": this.myProps.stat,
      "Start time": apiStartTime.toString(),
      "End time": apiEndTime.toString(),
      "Time format": this.myProps.timeZone
      };
      console.log(data);
      // @ts-ignore
      let responseData = await axios.post(
        this.$store.state.baseUrl+":3443/api/analytics/smart_sensor_plot_data_vrf/123-567-8910",
        data
      );
      // work for no data found
      if (responseData.data["Line Plot"] === "No Data Found") {
        this.noData = true;
        this.loader = false;
        this.view = false;
      } else {
        this.linedata.layout.title.text = responseData.data["Line PLot"].Title[0];
        this.linedata.layout.yaxis.title = responseData.data["Line PLot"].Unit[0];
        responseData.data["Line PLot"]["Stat"].forEach((itemStat:any,indexStat:any)=>{
          // console.log(itemStat);
          // console.log(indexStat);
          let xAxis:any = [];
          let yAxis:any = [];
          responseData.data["Line PLot"]["Value"].forEach((item:any, index:any)=>{
            xAxis.push(item[0])
            yAxis.push(item[indexStat+1])
          })
          const data:any = {
            x: xAxis,
            y: yAxis,
            type: "line",
            showlegend: true,
            name: itemStat,
          }
          this.linedata.data.push(data)
        });
        this.view = true;
        this.loader = false;
        this.noData = false;
      }

      //wok for no data end
    }
  }
}
</script>