import { shallowMount } from '@vue/test-utils'
import EventTrap from '../../src/components/EventTrap.vue';
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

describe('EventTrap.vue', () => {
    let vuetify;
    beforeEach(() => {
        vuetify = new Vuetify();
        Vue.use(Vuetify)
    });

    const mockProcessResult = jest.fn(()=>{
        console.log("Mock process function");
        let data = {
            machine: "MDB",
            stat: "Voltage(L-N)",
            threshold: 15,
            quickTime: "",
            fromDate: "20-2-2020",
            fromHourMinutes: "10:05",
            toDate: "21-2-2020",
            toHourMinutes: "10:10",
            timeZone: "IST"
        }
        if(data.quickTime !== ""){
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
                "Start time": apiStartTime.toString(),
                "End time": apiEndTime.toString(),
                "Event trap time": "",
                "FFT instant": "",
                "Time format": data.timeZone
            };
            // console.log(dataSet)
            if(dataSet["Machine name"] !== "" && dataSet["Start time"] !== "" && 
            dataSet["End time"] !== "" && dataSet["Time format"] && dataSet["FFT instant"] === "" 
            && dataSet["Event trap time"] === "") {
                return { processEventTrap: true}
            }else{
                return { processEventTrap: false}
            }
        }else{
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
                "Start time": apiStartTime.toString(),
                "End time": apiEndTime.toString(),
                "Event trap time": "",
                "FFT instant": "",
                "Time format": data.timeZone
            };
            if(dataSet["Machine name"] !== "" && dataSet["Start time"] !== "" && 
            dataSet["End time"] !== "" && dataSet["Time format"] && dataSet["FFT instant"] === "" 
            && dataSet["Event trap time"] === "") {
                return { processEventTrap: true}
            }else{
                return { processEventTrap: false}
            }
        }
        
    });

    const mockProcessEventForSine = jest.fn(()=>{
        let data = {
            "Machine name": "MDB",
            "Start time": "173297709793",
            "End time": "173297709797",
            "Event trap time": "175297709799",
            "FFT instant": "",
            "Time format": "IST",
            "sine_wave_stat": "Current_3ph"
        }
        if( data["Machine name"] !== "" && data["Start time"] !== "" && data["End time"] !== ""
        && data["Event trap time"] !== "" && data["FFT instant"] === "" && data["Time format"] !== ""
        && data["sine_wave_stat"] !== ""){
            return { sinePlot: true };
        }else {
            return { sinePlot: false };
        }
    });

    const mockProcessEventForFft = jest.fn(()=>{
        let data = {
            "Machine name": "MDB",
            "Start time": "17930903795",	
            "End time": "17930903797",
            "Event trap time": "",
            "FFT instant": "17930903799",
            "Time format": "IST",
            "sine_wave_stat": "",
            "fft_stat": "Phase_3_Current"
        }
        if( data["Machine name"] !== "" && data["Start time"] !== "" && data["End time"] !== ""
        && data["Event trap time"] === "" && data["FFT instant"] !== "" && data["Time format"] !== ""
        && data["sine_wave_stat"] === "" && data["fft_stat"] !== ""){
            return { fftPlot: true };
        }else {
            return { fftPlot: false };
        }
    });

    it('Event Trap Process Data Working Properly And Bar Plot Rendered', ()=>{
        const wrapper:any = shallowMount(EventTrap, {
            methods:{
                processResult: () =>{}
            }
        })
        
        wrapper.setMethods({processResult: mockProcessResult});
        const x = wrapper.vm.processResult();
        expect(x.processEventTrap).toBe(true);
    });

    it('Event Trap Sine Plot Working Properly', ()=>{
        const wrapper:any = shallowMount(EventTrap, {
            methods: {
                processResult: () =>{}
            }
        })
        wrapper.setMethods({processEventForSine: mockProcessEventForSine});
        const x = wrapper.vm.processEventForSine();
        // console.log(x);
        expect(x.sinePlot).toBe(true);
    });

    it('Event Trap fft Plot Working Properly', ()=>{
        const wrapper:any = shallowMount(EventTrap, {
            methods: {
                processResult: () =>{}
            }
        })
        wrapper.setMethods({proccesEventForFft: mockProcessEventForFft});
        const x = wrapper.vm.proccesEventForFft();
        // console.log(x);
        expect(x.fftPlot).toBe(true);
    });
});