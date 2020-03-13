import Vue from "vue";
import axios from "axios";
import { Component,  Watch, Prop } from "vue-property-decorator";
//@ts-ignore
import VuePlotly from "@statnett/vue-plotly";
//@ts-ignore
import JsonCSV from "vue-json-csv";
import DataTable from "../../components/DataTable.vue";
import LinePlot from "../../components/LinePlot.vue";
import MaxLine from "../../components/MaxLine.vue";
import MinLine from "../../components/MinLine.vue";

Vue.component("downloadCsv", JsonCSV);

@Component({
  components: {
    VuePlotly,
    DataTable,
    LinePlot,
    MaxLine,
    MinLine
  }
})


export default class Statistics extends Vue {
  // @ts-ignore
  @Prop() clickBar;
  clickBarValue:any = "";

  @Watch('clickBar', {immediate: true, deep: true})
  barClick(){
    this.clickBarValue = parseInt(this.clickBar.slice(0,-2))
    // console.log(this.clickBar.slice(0,-2));
  }

  @Watch('$route', { immediate: true, deep: true })
  async onUrlChange(routeName: any) {
    this.fakeDetail = true;
    this.showTab = false;
    this.stat = "";
    this.threshold = "";
    this.quickTime = "";
    this.toDate = "";
    this.toHourMinutes = "";
    this.fromDate = "";
    this.fromHourMinutes = "";
    // this.timeZone = "";

    console.log(routeName.params.name);
    if(!routeName.params.name){
      console.log("No changing route")
    }else{      
      this.machine = routeName.params.name;
      console.log("route changing");
      this.disabledInput = false; 
      // console.log(this.machineId);
    }
  }

  // only for show and hide the tab
  disabledInput?:boolean= true;
  fakeDetail = true;
  showTab = false;
  // calender
  menu1 = false;
  menu2 = false;
  date = new Date().toISOString().substr(0, 10);
  // calender end
  time1 = false;
  time1menu = false;
  time2menu = false;
  time1modal = false;

  // max min logic
  maxMin?:boolean;
  normal?:boolean;
  noEventTab?: boolean;

  formData!: any;

  // tab section
  tab: any = 0;
  machineList = [];

  statList:any[] = [
    { name: "Temperature", value: "Temperature" },
    { name: "Moisture", value: "Moisture" },
    { name: "Voltage(L-N)", value: "Voltage(L-N)" },
    { name: "Current", value: "Current" },
    { name: "Humidity",value: "Humidity"},
    { name: "Voltage variation (%)", value: "Voltage variation (%)" }
  ];
  quicktimeList = [
    {name: "5 Minutes", value: "5m"},{name: "10 Minutes", value: "10m"}, {name: "15 Minutes", value: "15m"}, 
    {name: "30 Minutes", value: "30m"}, {name: "1 Hours", value: "1h"}, {name: "3 Hours", value: "3h"},
    {name: "6 Hours", value: "6h"}, {name: "12 Hours", value: "12h"}, {name: "24 Hours", value: "24h"}, {name: "2 Days", value: "2d"}, 
    {name: "3 Days", value: "3d"}    
  ]
  timeZoneList = ["IST", "UTC", "EST"];
  items = ["Line Plot", "Max", "Min", "Data Table"]; 
  // tab section end


  async created() {
    // let statList = await axios.get('http://52.142.17.219:5000/fetchStats'); 
    // this.statList = statList.data;
    // console.log(this.timeZone);
    this.timeZone = "IST"
    // console.log("hi")
  }
  
  // ==========================================
  // dialog form for input start from here
  machine = "";
  group = "";
  stat = "";
  threshold:any = "";
  toDate = "";
  toHourMinutes = "";
  fromDate = "";
  fromHourMinutes = "";
  quickTime  = "";
  timeZone = "";

  toHours = "";
  toMinutes = "";
  formHours = "";
  formMinutes = "";
  valid = ""


  thresHoldRes:any; //getting threshold name
  machineId:any; //getting machine id

  allData:any = {};

  dialog = false;

  // number = [
  //   (v:any) => !!v || 'data is required',
  // ]

  clickTime(){
    // if(this.stat){
      let data = {
        machine: this.machine,
        stat: this.stat,
        threshold: this.threshold,
        quickTime: this.quickTime,
        fromDate: this.fromDate,
        fromHourMinutes: this.formHours+":"+this.formMinutes,
        toDate: this.toDate,
        toHourMinutes: this.toHours+":"+this.toMinutes,
        timeZone: this.timeZone
      }
      this.allData = data;
      return 1;
    // }
  }
  clickQuickTime(){
    if(this.stat !== ""){
      console.log(this.stat);
      let data = {
        machine: this.machine,
        stat: this.stat,
        threshold: this.threshold,
        quickTime: this.quickTime,
        fromDate: "",
        fromHourMinutes: "",
        toDate: "",
        toHourMinutes: "",
        timeZone: this.timeZone
      }
      this.allData = data;
      this.fakeDetail = false;
      this.showTab = true;
      return 1;
    }
  }

  submitTimeInput(){
    this.dialog = false;
    let data = {
      machine: this.machine,
      stat: this.stat,
      threshold: this.threshold,
      quickTime: "",
      fromDate: this.fromDate,
      fromHourMinutes: this.formHours+":"+this.formMinutes,
      toDate: this.toDate,
      toHourMinutes: this.toHours+":"+this.toMinutes,
      timeZone: this.timeZone
    }

    this.allData = data;
    // console.log(this.allData)
    // console.log(data)
    this.fakeDetail = false;
    this.showTab = true;
    this.quickTime = ""
    return this.showTab;
    
  }

  clearInput(){
    this.dialog = true;
    //@ts-ignore
    // this.$refs.formQuickTime.reset();
    //@ts-ignore
    this.$refs.formCustomTime.reset();
  }

  clickStat(){
    if(this.quickTime !== "" || this.toDate !== ""){
      let data = {
        machine: this.machine,
        stat: this.stat,
        threshold: this.threshold,
        quickTime: this.quickTime,
        fromDate: this.fromDate,
        fromHourMinutes: this.formHours+":"+this.formMinutes,
        toDate: this.toDate,
        toHourMinutes: this.toHours+":"+this.toMinutes,
        timeZone: this.timeZone
      }
      this.allData = data;
      this.showTab = true;
      this.fakeDetail = false;
    }
  }


  minutesRule = [
    (v:any) => !!v || "Item is required",
    (v:any) => (v >= 0 && v < 60) || "Must be (00-59)" 
  ]

  hoursRule = [
    (v:any) => !!v || "Item is required",
    (v:any) =>(v >= 0 && v <= 24) || "Must be (00-24)" 
  ]
}                                                                                                                                                                                                                                                                              