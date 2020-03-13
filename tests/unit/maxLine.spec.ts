import { shallowMount } from '@vue/test-utils'
import MaxLine from '../../src/components/MaxLine.vue';
// import sinon from 'sinon'
import Vue from 'vue'
import Vuetify from 'vuetify'

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
    GeolocateControl: jest.fn(),
    Map: jest.fn(() => ({
        addControl: jest.fn(),
        on: jest.fn(),
        remove: jest.fn()
    })),
    NavigationControl: jest.fn()
}));

describe('MaxLine.vue', () => {
    let vuetify;
    beforeEach(() => {
        vuetify = new Vuetify();
        Vue.use(Vuetify)
    })
    it('Process Data For Max Line Plot Work Properly', () => {

      const mockProcessData = jest.fn(()=>{
        let data = {
            machine: "MDB",
            stat: "Voltage(L-N)",
            threshold: 15,
            quickTime: "5m",
            fromDate: "",
            fromHourMinutes: "",
            toDate: "",
            toHourMinutes: "",
            timeZone: "IST"
        }
        if(data.quickTime){
            let startTime: any;
            let getUnitStr = data.quickTime.split("");
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
            const date = new Date();
            const apiEndTime = Math.floor(date.getTime());
            let dataSet = {
                "Machine name": data.machine,
                "Stat name": data.stat,
                "Start time": apiStartTime.toString(),
                "End time": apiEndTime.toString(),
                "Time format": data.timeZone
            };
            if(dataSet["Machine name"] !== "" && dataSet["Stat name"] !== ""
            && dataSet["Start time"] !== "" && dataSet["End time"] !== "" && dataSet["Time format"]) {
                return {view: true, loader: false};
            }else {
                return {view: false, loader: true};
            }
        }else {
            const dateStart = new Date(
                data.fromDate + " " + data.fromHourMinutes
            );
            const apiStartTime = Math.floor(dateStart.getTime());
            const endStart = new Date(
                data.toDate + " " + data.toHourMinutes
            );
            const apiEndTime = Math.floor(endStart.getTime());
            let dataSet = {
                "Machine name": data.machine,
                "Stat name": data.stat,
                "Start time": apiStartTime.toString(),
                "End time": apiEndTime.toString(),
                "Time format": data.timeZone
            };
            if(dataSet["Machine name"] !== "" && dataSet["Stat name"] !== ""
            && dataSet["Start time"] !== "" && dataSet["End time"] !== "" && dataSet["Time format"]) {
                return {view: true, loader: false};
            }else {
                return {view: false, loader: true};
            }
        }
      })

        const wrapper:any = shallowMount(MaxLine, {
          methods: {
            processData: () => {}
          },
          propsData: {
            myProps:  {
                machine: "machine",
                stat: "Voltage(L-N)",
                threshold: 15,
                quickTime: "5m",
                fromDate: "",
                fromHourMinutes: "",
                toDate: "",
                toHourMinutes: "",
                timeZone: "IST"
            }
          }
        })

        wrapper.setMethods({processData: mockProcessData})
        const x = wrapper.vm.processData();
        expect(x.view).toBe(true);
        expect(x.loader).toBe(false);
      }) 
});