<template>
  <v-container fluid>
    <p style="display:none;">hello193</p>
    <v-row style="padding: 0 6px;">
      <v-col cols="12">
        <!-- machine & stat row start -->
        <v-row>
          <v-col cols="4">
            <v-select 
              v-bind:disabled = "disabledInput" 
              :items="statList" 
              label="Sensors"
              item-value="value"
              item-text="name" 
              v-model="stat"
              @change="clickStat(stat)"></v-select>
          </v-col>

          <v-col cols="3">
            <v-select v-model="quickTime" :items="quicktimeList" item-text="name"
              v-bind:disabled = "disabledInput"
              item-value="value"
              prepend-icon="mdi-alarm-check"
              label="Quick Time"
              @input="clickQuickTime(quickTime)"
            ></v-select>
          </v-col>

          <v-col cols="2">
            <v-select
              v-model="timeZone"
              :items="timeZoneList"
              prepend-icon="mdi-settings"
              label="Time Zone"
              @change="clickTime(timeZone)"
              v-bind:disabled = "disabledInput"
            ></v-select>
          </v-col>

          <v-col cols="2" style="padding-top: 20px;">
            <!-- "Change input time Dialog" -->
            <v-btn v-bind:disabled = "disabledInput" text color="primary lighten-2" dark @click.stop="dialog = true">Custom Time</v-btn>
            <v-dialog width="380" style="margin-left:20px" v-model="dialog">
              <v-card>
                <div class="cardContent">
                  <v-form class="formContent2" v-model="valid" ref="formCustomTime">
                    <!-- form date -->
                    <v-menu
                      ref="menu1"
                      v-model="menu1"
                      :close-on-content-click="true"
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="fromDate"
                          prepend-icon="mdi-calendar-check"
                          label="From Date"
                          :rules="[v => !!v || 'Item is required']"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="fromDate" no-title scrollable>
                        <div class="flex-grow-1"></div>
                        <!-- <v-btn text color="primary" @click="menu1 = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.menu1.save(date)">OK</v-btn> -->
                      </v-date-picker>
                    </v-menu>
                    <!-- <v-menu
                      ref="selectTime2"
                      v-model="time2menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time2menu"
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="fromHourMinutes"
                          prepend-icon="mdi-calendar-clock"
                          label="Select Hour & Minutes"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="time2menu"
                        v-model="fromHourMinutes"
                        full-width
                        @click:minute="$refs.selectTime2.save(fromHourMinutes)"
                      ></v-time-picker>
                    </v-menu> -->
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model="formHours"
                          type="number"
                          :rules="hoursRule"
                          prepend-icon="mdi-calendar-clock"
                          label="Hours"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="formMinutes"
                          type="number"
                          :rules="minutesRule"
                          prepend-icon="mdi-calendar-clock"
                          label="Minutes"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <!-- To date-->
                    <v-menu
                      ref="menu2"
                      v-model="menu2"
                      :close-on-content-click="true"
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="toDate"
                          prepend-icon="mdi-calendar-check"
                          :rules="[v => !!v || 'Item is required']"
                          label="To Date"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="toDate" no-title scrollable>
                        <div class="flex-grow-1"></div>
                        <!-- <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.menu2.save(date)">OK</v-btn> -->
                      </v-date-picker>
                    </v-menu>
                    <!-- <v-menu
                      ref="selectTime1"
                      v-model="time1menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time1menu"
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="toHourMinutes"
                          prepend-icon="mdi-calendar-clock"
                          label="Select Hour & Minutes"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="time1menu"
                        v-model="toHourMinutes"
                        full-width
                        @click:minute="$refs.selectTime1.save(toHourMinutes)"
                      ></v-time-picker>
                    </v-menu> -->
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model="toHours"
                          type="number"
                          prepend-icon="mdi-calendar-clock"
                          :rules="hoursRule"
                          label="Hours"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="toMinutes"
                          type="number"
                          prepend-icon="mdi-calendar-clock"
                          :rules="minutesRule"
                          label="Minutes"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    
                    <!-- to date end -->
                    
                  </v-form>
                </div>
                <div class="text-center" style="padding-bottom:20px;">
                  <v-btn
                    dark
                    color="primary"
                    @click="submitTimeInput()"
                    :disabled="!valid"
                    style="margin-right:10px;"
                  >Submit</v-btn>
                  <v-btn color="warning" dark @click="clearInput()" :disabled="!valid">Clear</v-btn>
                </div>
              </v-card>
            </v-dialog>
            <!-- end input time dialog -->
          </v-col>
        </v-row>
        <!-- machine & stat row end -->
      </v-col>
    </v-row>

    <!-- ============================================================================
    ============================================================================-->
    <!-- tab section start here -->
    <v-row v-if="fakeDetail">
      <v-col cols="12">
        <v-card style="height:350px;padding-top:70px">
          <div class="text-center">
            <h3 style="color:#1156e1;">INSTRUCTION</h3>
            <hr style="width:10%; margin:auto">
            <p style="margin-bottom:0px;padding-top:30px">1. Please Select <b>Machine</b> First</p>
            <p>2. Then Choose Corresponding <b>Input</b></p>
            <img src="../../assets/tap.svg" style="width:7%;color:blue">
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="showTab">
      <v-col cols="12">
        <v-card>
          <v-tabs v-model="tab" background-color="blue-grey lighten-5" grow>
            <v-tab v-for="(item, index) in items" :key="index">{{ item }}</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <!-- line-plot -->
              <v-card flat color="basil" class="text-center">
                <LinePlot :myProps="allData" :barClick = "clickBarValue"/>
              </v-card>
              <!-- line-plot end -->
            </v-tab-item>
            <v-tab-item>
              <v-card flat color="basil">
                <MaxLine :myProps="allData" :barClick = "clickBarValue"/>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat color="basil">
                <MinLine :myProps="allData" :barClick = "clickBarValue"/>
              </v-card>
            </v-tab-item>
            <!-- <v-tab-item>
              <v-card flat color="basil">
                <EventTrap :statData="statList" :myProps="allData"></EventTrap>
              </v-card>
            </v-tab-item> -->
            <!-- data-table -->
            <v-tab-item>
              <v-card class="tabContent">
                <DataTable :myProps="allData"></DataTable>
              </v-card>
            </v-tab-item>
            <!-- data-table-end -->
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" src = "./Statistics.ts">
</script>

<style lang = "scss" scoped>
.tabContent {
  padding: 35px;
  /* background: url(../assets) */
}
.cardContent p {
  border-bottom: 1px solid #8080803d;
  color: #363535b9;
  padding-bottom: 7px;
}
.cardContent {
  padding: 20px;
}
.v-tab--active{
  background-image: linear-gradient(45deg,#00b09b,#96c93d)!important;
  color: #f2f2f2!important;
}
</style>