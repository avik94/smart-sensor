import { shallowMount } from '@vue/test-utils'
import Statistics from '../../src/views/Statistics/Statistics';
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

// const mockCallback = jest.mock('', ()=>{
//   console.log("hello World")
// });

describe('Statistics.ts', () => {
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
    Vue.use(Vuetify)
  })
  it('Click Quick time Working Properly', () => {
    const wrapper = shallowMount(Statistics, {
      methods: {
        onUrlChange: () => {}
      },
      propsData: { clickBar: '230px' }
    })
    let x = wrapper.vm.clickQuickTime();
    // console.log(x);
    expect(x).toBe(1);
  })

  it('Click time format Working Properly', () => {
    const wrapper = shallowMount(Statistics, {
      methods: {
        onUrlChange: () => {}
      },
      propsData: { clickBar: '230px' }
    })
    let x = wrapper.vm.clickTime();
    // console.log(x);
    expect(x).toBe(1);
  })

  it('Submit Time Input Working Properly', () => {
    const wrapper = shallowMount(Statistics, {
      methods: {
        onUrlChange: () => {}
      },
      propsData: { clickBar: '230px' }
    })
    let x =  wrapper.vm.submitTimeInput();
    // console.log(x);
    expect(x).toBe(true);
  })

  it('Time Zone List Should Be [IST, UTC, EST]', () => {
    const wrapper = shallowMount(Statistics, {
      methods: {
        onUrlChange: () => {}
      },
      propsData: { clickBar: '230px'}
    })

    let x = wrapper.vm.timeZoneList;
    // console.log(x);
    expect(x[0]).toBe('IST');
    expect(x[1]).toBe('UTC');
    expect(x[2]).toBe('EST');
  })

  it('Stat List Should Be [Voltage(L-N),"Voltage(L-L),Current-3 phase,PF-3 phase, Neutral current,Step Current Change (A), ...]', () => {

    const wrapper = shallowMount(Statistics, {
      methods: {
        onUrlChange: () => {}
      },
      propsData: { clickBar: '230px'}
    })
        
    let x = wrapper.vm.statList;
    expect(x[0]).toBe("Voltage(L-N)");
    expect(x[1]).toBe("Voltage(L-L)");
    expect(x[2]).toBe("Current-3 phase");
    expect(x[3]).toBe("PF-3 phase");
    expect(x[4]).toBe('Neutral current');
    expect(x[5]).toBe('Step Current Change (A)');
  })

  it("Clear Input Working Properly", ()=>{
    const clearInputMock = jest.fn(()=>{
      return {dialog : true, formClear: true};
    });
    const wrapper = shallowMount(Statistics, {
      methods: {
        onUrlChange: ()=>{},
        barClick: () => {}
      }
    })

    wrapper.setMethods({clearInput: clearInputMock});
    const x:any = wrapper.vm.clearInput();
    expect(x.dialog).toBe(true);
    expect(x.formClear).toBe(true);

  })

}) 
