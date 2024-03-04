<template>
  <div
    class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header"
  >
    <!-- top nav -->
    <topNavigation />

    <div class="app-main">
      <!-- side nav -->
      <sideNavigation @SideBarToggle="ToggleOnOff" />
      <div class="app-main__outer" id="boxs"  v-bind:style="{'margin-left': '64px', 'transition': none}">
        <div class="app-main__inner">
          <div v-if="!loaderValue">
            <loader />
          </div>
          <div v-if="loaderValue">
            <div class="app-page-title bg-light p-1 Toptitle" id="HeaderTask">
              <div class="page-title-wrapper">
                <div class="page-title-heading">
                  <router-link exact :to="'/home'">
                    <v-img
                      class="logo"
                      src="../../assets/Images/logo.png"
                      alt="logo"
                      width="40"
                    ></v-img
                  ></router-link>

                  <div
                    class="names"
                    :title="`${ProjectData.project_name} (${ProjectData.project_code})`"
                  >
                    {{ ProjectData.project_name }} ({{
                      ProjectData.project_code
                    }})
                  </div>
                </div>
                <div id="searchTask">
                  <v-form
                    id="formSearch"
                    ref="form"
                    action=""
                    @keyup.enter="searchTask()"
                    @submit.prevent="searchTask()"
                  >
                    <v-text-field
                      v-model="normalSearch.keyWord"
                      label="Search Task"
                      outlined
                      rounded
                      clearable
                      @click:clear="ClrSelect()"
                      prepend-inner-icon="mdi-magnify"
                      dense
                      @keyup="searchTask()"
                    ></v-text-field>
                  </v-form>
                </div>
              </div>
            </div>

            <template>
              <div>
                <div style="justify-space-between bottom-60">
                  <!--------------------------------------filter--------------------------------------------------------------------->

                  <div class="adavancesearchtoggle">
                    <v-btn-toggle mandatory>
                      <v-btn
                        class="togglesearch"
                        title="Search"
                        @click="
                          search = !serch;
                          advanced = false;
                          getTask(1);
                          toggleSearch2();
                        "
                        id="btnshadow"
                        >Search</v-btn
                      >
                      <v-btn
                     
                        class="togglesearch"
                        title="Advanced Search"
                        test-data="BtnId1"
                        @click="
                          advanced = !advnced;
                          search = false;

                          getsubTask(1);
                          toggleSearch();
                        "
                        >Advanced Search</v-btn
                      >
                    </v-btn-toggle>
                  </div>

                  <v-spacer></v-spacer>
                  <!---------------------------------------Normal Seaaaaaarch----------------------------------------------------------------------->

                  <div
                    style="align-items: center"
                    v-show="search"
                    class="statusFlex"
                  >
                    <div
                 
                      style=" margin-top: 3%"
                    >
                      Status:
                    </div>&nbsp;&nbsp;&nbsp;
                    <div class="buttons">
                      <v-btn
                        outlined
                        rounded
                        color="black"
                        width="100px"
                        title="All"
                        value="1"
                        @click="getTask(1)"
                        height="30px"
                        :class="{ green: all }"
                        class="normalfilterbtn"
                      >
                        All
                      </v-btn>
                      <v-btn
                        outlined
                        rounded
                        title="Open"
                        color="black"
                        width="100px"
                        value="2"
                        :class="{ green: open }"
                        @click="getTask(2)"
                        height="30px"
                        class="normalfilterbtn"
                      >
                        Open
                      </v-btn>

                      <v-btn
                        outlined
                        rounded
                        color="black"
                        value="3"
                        title="InProgress"
                        :class="{ green: inprogress }"
                        width="100px"
                        @click="getTask(3)"
                        height="30px"
                        class="normalfilterbtn"
                      >
                        InProgress
                      </v-btn>
                      <v-btn
                        outlined
                        rounded
                        color="black"
                        width="100px"
                        value="5"
                        title=" Closed"
                        :class="{ green: closed }"
                        @click="getTask(5)"
                        height="30px"
                        class="normalfilterbtn"
                      >
                        Closed
                      </v-btn>
                      <v-btn
                        outlined
                        rounded
                        title=" Resolved"
                        value="4"
                        :class="{ green: resolved }"
                        color="black"
                        width="100px"
                        @click="getTask(4)"
                        height="30px"
                        class="normalfilterbtn"
                      >
                        Resolved
                      </v-btn>
                    </div>

                    <div class="subTasking">
                      <div
                        class="page-title-heading"
                        style="margin-top: 2%"
                      >
                        Subtasking:
                      </div>
                      <div class="buttonsTwo">
                        <v-btn
                          outlined
                          rounded
                          title="All"
                          color="black"
                          width="100px"
                          :class="{ green: allsub }"
                          @click="getsubTask(1)"
                          height="30px"
                          class="normalfilterbtn"
                        >
                          All
                        </v-btn>
                        <v-btn
                          outlined
                          rounded
                          title=" Parent issue"
                          color="black"
                          width="100px"
                          :class="{ green: parent }"
                          @click="getsubTask(2)"
                          height="30px"
                          class="normalfilterbtn"
                        >
                          Parent issue
                        </v-btn>
                        <v-btn
                          outlined
                          rounded
                          color="black"
                          width="100px"
                          title="Exclude Child"
                          :class="{ green: excludechild }"
                          @click="getsubTask(3)"
                          height="30px"
                          class="normalfilterbtn"
                        >
                          Exclude Child
                        </v-btn>
                      </div>
                    </div>
                  </div>

                  <div v-show="advanced" class="adavancedsearchDiv">
                    <div>
                      <v-btn-toggle mandatory>
                        <v-btn
                          class="cmnbtnstyle"
                          title="General"
                          @click="
                            general = !genral;
                            datesearch = false;
                          "
                          >General</v-btn
                        >
                        <v-btn
                          class="cmnbtnstyle"
                          @click="
                            datesearch = !dateserch;
                            general = false;
                          "
                          title="Date"
                          >Date</v-btn
                        >
                      </v-btn-toggle>
                      <!------------------------------------------------General search in adma-------------------------------------------------->
                      <div class="general" v-show="general">
                        <v-row>
                          <v-col cols="12" class="firstrowsearch">
                            <v-col cols="6" lg="2" sm="8" xs="8" class="status">
                              <div>
                                <span>Task Status </span>

                                <v-card>
                                  <v-list>
                                    <v-list-item-group multiple>
                                      <template>
                                        <v-list-item
                                          v-for="item in t_status"
                                          :key="item.name"
                                        >
                                          <template>
                                            <v-list-item-content
                                              @click="selectStatus(item.id)"
                                            >
                                              <v-list-item-title
                                                v-text="item.name"
                                              ></v-list-item-title>
                                            </v-list-item-content>
                                          </template>
                                        </v-list-item>
                                      </template>
                                    </v-list-item-group>
                                  </v-list>
                                </v-card></div
                            ></v-col>
                            <v-col cols="6" lg="2" sm="8" xs="8" class="status">
                              <div>
                                <span>Priority</span>
                                <v-card id="minHeight">
                                  <v-list>
                                    <v-list-item-group multiple>
                                      <template>
                                        <v-list-item
                                          v-for="item in t_priority"
                                          :key="item.id"
                                        >
                                          <template>
                                            <v-list-item-content
                                              @click="selectpriority(item.id)"
                                            >
                                              <v-list-item-title
                                                v-text="item.name"
                                              ></v-list-item-title>
                                            </v-list-item-content>
                                          </template>
                                        </v-list-item>
                                      </template>
                                    </v-list-item-group>
                                  </v-list>
                                </v-card></div
                            ></v-col>

                            <v-col cols="6" lg="2" sm="8" xs="8" class="status">
                              <div>
                                <span>Category</span>
                                <v-card id="maxHeight">
                                  <v-list id="maxAuto">
                                    <v-list-item-group multiple>
                                      <template>
                                        <v-list-item
                                          v-for="item in category_list"
                                          :key="item.category_id"
                                        >
                                          <template>
                                            <v-list-item-content
                                              @click="
                                                selectCategory(item.category_id)
                                              "
                                            >
                                              <v-list-item-title
                                                v-text="item.category"
                                              ></v-list-item-title>
                                            </v-list-item-content>
                                          </template>
                                        </v-list-item>
                                      </template>
                                    </v-list-item-group>
                                  </v-list>
                                </v-card></div
                            ></v-col>

                            <v-col cols="6" lg="2" sm="8" xs="8" class="status">
                              <div>
                                <span>Issue type</span>
                                <v-card id="maxHeight">
                                  <v-list id="maxAuto">
                                    <v-list-item-group multiple>
                                      <template>
                                        <v-list-item
                                          v-for="item in issue_list"
                                          :key="item.issue_type_id"
                                        >
                                          <template>
                                            <v-list-item-content
                                              @click="
                                                selectIssuetype(
                                                  item.issue_type_id
                                                )
                                              "
                                            >
                                              <v-list-item-title
                                                v-text="item.issue_type"
                                              ></v-list-item-title>
                                            </v-list-item-content>
                                          </template>
                                        </v-list-item>
                                      </template>
                                    </v-list-item-group>
                                  </v-list>
                                </v-card></div
                            ></v-col>
                            <v-col cols="6" lg="2" sm="8" xs="8" class="status">
                              <div>
                                <span>Assignee</span>
                                <v-card id="minHeight">
                                  <v-list id="maxAuto">
                                    <v-list-item-group multiple>
                                      <template>
                                        <v-list-item
                                          v-for="item in userlist_forassignee"
                                          :key="item.user_name"
                                        >
                                          <template>
                                            <v-list-item-content
                                              @click="
                                                selectAssignee(item.user_id)
                                              "
                                            >
                                              <v-list-item-title
                                                v-text="item.user_name"
                                              ></v-list-item-title>
                                            </v-list-item-content>
                                          </template>
                                        </v-list-item>
                                      </template>
                                    </v-list-item-group>
                                  </v-list>
                                </v-card></div
                            ></v-col>
                          </v-col>
                          <v-col cols="12" class="seconddivSearch">
                            <v-col cols="6" lg="2" sm="8" xs="8" class="status">
                              <div>
                                <span>Created By</span>
                                <v-card id="minHeight">
                                  <v-list id="maxAuto">
                                    <v-list-item-group multiple>
                                      <template>
                                        <v-list-item
                                          v-for="item in user_list"
                                          :key="item.user_name"
                                        >
                                          <template>
                                            <v-list-item-content
                                              @click="
                                                selectCreatedby(item.user_id)
                                              "
                                            >
                                              <v-list-item-title
                                                v-text="item.user_name"
                                              ></v-list-item-title>
                                            </v-list-item-content>
                                          </template>
                                        </v-list-item>
                                      </template>
                                    </v-list-item-group>
                                  </v-list>
                                </v-card></div
                            ></v-col>
                            <v-col cols="6" lg="2" sm="8" xs="8" class="status">
                              <div>
                                <span>Others</span>

                                <div class="radiobtn">
                                  <v-radio-group>
                                    <v-radio
                                      value="1"
                                      label="All"
                                      @click="selectRelation([1, 2, 3])"
                                    ></v-radio>
                                    <v-radio
                                      value="2"
                                      label="Parent Issue"
                                      @click="selectRelation([2])"
                                    ></v-radio>
                                    <v-radio
                                      value="1,2"
                                      label="Exclude child Issue"
                                      @click="selectRelation([1, 2])"
                                    ></v-radio>
                                  </v-radio-group>
                                </div></div
                            ></v-col>
                          </v-col>
                        </v-row>
                      </div>
                      <!-----------------------------Date search------------------------------------------->
                      <div class="date" v-show="datesearch">
                        <div style="margin-top: 3%">
                          <v-row>
                            <v-col cols="12" class="d-flex">
                            <v-col
                        
                              
                                lg="2"
                                md="2"
                                sm="2"
                                xs="2"
                            >
                              <span style="margin-top: 2%">Start Date :</span></v-col>
<v-col  lg="8" md="8" sm="8" xs="8">
                              <v-menu
                                v-model="menu"
                                min-width="auto"
                                :close-on-content-click="false"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    dense
                                    v-model="adv_general.start_date_from_date"
                                    placeholder="From"
                                    icon="mdi-calendar"
                                    readonly
                                    outlined
                                    :rules="startdateRules"
                                    v-bind="attrs"
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="adv_general.start_date_from_date"
                                  no-title
                                  scrollable
                                  @input="menu = false"
                                ></v-date-picker>
                              </v-menu>
                            </v-col>
                            </v-col>
                            <v-col cols="12" class="d-flex">
                              <v-col
                              
                                lg="2"
                                md="2"
                                sm="2"
                                xs="2"
                              ></v-col>
                              <v-col  lg="8" md="8" sm="8" xs="6">
                              <v-menu
                                v-model="menu1"
                                min-width="auto"
                                :close-on-content-click="false"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    class="starttodate"
                                    dense
                                    v-model="adv_general.start_date_to_date"
                                    placeholder="To"
                                    icon="mdi-calendar"
                                    readonly
                                    outlined
                                    :rules="startdateRules"
                                    v-bind="attrs"
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="adv_general.start_date_to_date"
                                  no-title
                                  scrollable
                                  @input="menu1 = false"
                                ></v-date-picker>
                              </v-menu>
                              </v-col>
                            </v-col>
                           
                          </v-row>
                          <v-row>
                            <v-col cols="12" class="d-flex">
                            <v-col
                              
                                lg="2"
                                md="2"
                                sm="2"
                                xs="2"
                            >
                              <span style="margin-top: 2%">End Date :</span></v-col>
<v-col  lg="8" md="8" sm="8" xs="8">
                              <v-menu
                                v-model="menu2"
                                min-width="auto"
                                :close-on-content-click="false"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    dense
                                    v-model="adv_general.due_date_from_date"
                                    placeholder="From"
                                    icon="mdi-calendar"
                                    readonly
                                    outlined
                                    :rules="startdateRules"
                                    v-bind="attrs"
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="adv_general.due_date_from_date"
                                  no-title
                                  scrollable
                                  @input="menu2 = false"
                                ></v-date-picker>
                              </v-menu>
                            </v-col>
                            </v-col>
                            <v-col cols="12" class="d-flex">
                              <v-col
                           
                                md="2"
                                sm="2"
                                xs="2"
                              ></v-col>
                              <v-col  lg="8" md="8" sm="8" xs="8">

                              <v-menu
                                v-model="menu3"
                                min-width="auto"
                                :close-on-content-click="false"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    class="endtodate"
                                    dense
                                    v-model="adv_general.due_date_to_date"
                                    placeholder="To"
                                    icon="mdi-calendar"
                                    readonly
                                    outlined
                                    :rules="startdateRules"
                                    v-bind="attrs"
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="adv_general.due_date_to_date"
                                  no-title
                                  scrollable
                                  @input="menu3 = false"
                                ></v-date-picker>
                              </v-menu>
                              </v-col>
                              </v-col>
                            
                          </v-row>
                        </div>
                      </div>

                      <v-row class="searchbtnAdvanced">
                        <v-btn
                          class="cmnbtnstyle"
                          color="#4fa5d6"
                          @click="advancedSearch"
                          >Search</v-btn
                        >
                      </v-row>
                    </div>
                  </div>
                  <br />
                  <div class="buttonsThree">
                    <v-btn
                      title=" Batch Update"
                      outlined
                      rounded
                      class="batchUpdate"
                      @click="openBatch"
                      :disabled="!valid"
                    >
                      Batch Update
                    </v-btn>

                    <v-select
                      class="viewoptions"
                      v-model="selectedHeaders"
                      :items="headers"
                      label="View Options"
                      multiple
                      outlined
                      return-object
                      rounded
                      dense
                      title="View Options"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip x-small v-if="index < 1">
                          <span>{{ item.text }}</span>
                        </v-chip>
                        <span
                          v-if="index === 1"
                          class="grey--text caption"
                          style="font-size: 10%"
                          >(+{{ selectedHeaders.length - 1 }} others)</span
                        >
                        <span
                          v-if="index === 0"
                          :hide-default-footer="true"
                        ></span>
                      </template>
                    </v-select>
                  </div>
                </div>

                <div class="d-flex justify-space-between">
                  <div style="float: left">
                    <v-container fluid>
                      <v-row> </v-row>
                    </v-container>
                  </div>
                </div>
                <!-------------------------------View Tasks---------------------------------------------->
                <div class="datatable">
                  <div v-if="task_list.task.length == 0">
                    <v-data-table
                    :mobile-breakpoint="100"
                      :headers="headersMap"
                      :items="task_list.task"
                      hide-default-footer
                      class="elevation-1"
                      @click:row="handleClick"
                    ></v-data-table>
                  </div>
                  <div v-if="task_list.task.length != 0">
                    <v-data-table
                    :mobile-breakpoint="100"
                      :headers="showHeaders"
                      :items="task_list.task"
                      class="elevation-1"
                      @click:row="handleClick"
                    >
                      <template v-slot:[`item.actions`]="{ item }" >
                        <tr class="previewDiv">
                        <div style="display: flex" >
                          <div class="iconHover">
                            <v-icon
                              class="mr-3"
                              color="blue"
                              @click.stop="previewModal(item.task_id)"
                              @click="previewModal(item.task_id)"
                              title="open issue in dialogue"
                              >mdi-open-in-new</v-icon
                            >
                          </div>
                        </div>
                      </tr>
                      </template>
                      <template v-slot:[`item.task_name`]="{ item }">
                        <div :title="item.task_name">
                          {{ truncate(item.task_name, 12) }}
                        </div>
                      </template>
                      <template
                        v-slot:[`item.task_category.category_name`]="{ item }"
                      >
                        <div
                          v-if="item.task_category"
                          class="categoriess"
                          :title="item.task_category.category_name"
                        >
                          {{
                            truncate(item.task_category.category_name, 15)
                          }}
                        </div>
                      </template>

                      <!--------------------Issue---------------------->
                      <template
                        v-slot:[`item.task_issue.issue_name`]="{ item }"
                      >
                        <td v-if="item.task_issue.issue_id == 1">
                          <v-btn
                            outlined
                            rounded
                            color="white"
                            width="100px"
                            height="30px"
                            class="issue1"
                          >
                            {{ item.task_issue.issue_name }}
                          </v-btn>
                        </td>
                        <td v-if="item.task_issue.issue_id == 2">
                          <v-btn
                            :title="item.task_issue.issue_name"
                            outlined
                            rounded
                            color="white"
                            width="100px"
                            height="30px"
                            class="issue2"
                          >
                            {{ item.task_issue.issue_name }}
                          </v-btn>
                        </td>
                        <td v-if="item.task_issue.issue_id == 3">
                          <v-btn
                            :title="item.task_issue.issue_name"
                            outlined
                            rounded
                            color="white"
                            width="100px"
                            height="30px"
                            class="issue3"
                          >
                            {{ item.task_issue.issue_name }}
                          </v-btn>
                        </td>
                        <td v-if="item.task_issue.issue_id == 4">
                          <v-btn
                            :title="item.task_issue.issue_name"
                            outlined
                            rounded
                            color="white"
                            width="100px"
                            height="30px"
                            class="issue4"
                          >
                            {{ item.task_issue.issue_name }}
                          </v-btn>
                        </td>
                        <td
                          v-if="
                            item.task_issue.issue_id != 1 &&
                            item.task_issue.issue_id != 2 &&
                            item.task_issue.issue_id != 3 &&
                            item.task_issue.issue_id != 4
                          "
                        >
                          <label
                            class="text-truncate"
                            color="plum"
                            width="100px"
                            height="30px"
                            id="issue5"
                            :title="item.task_issue.issue_name"
                          >
                            {{ item.task_issue.issue_name }}
                          </label>
                        </td>
                      </template>

                      <!-- TASK STATUS COLUMN -->
                      <template v-slot:[`item.task_status`]="{ item }">
                        <td v-if="item.task_status == 1">
                          <v-btn
                            outlined
                            rounded
                            color="white"
                            width="80px"
                            height="30px"
                            class="statusOpen"
                          >
                            Open
                          </v-btn>
                        </td>
                        <td v-if="item.task_status == 2">
                          <v-btn
                            outlined
                            rounded
                            color="white"
                            width="80px"
                            height="30px"
                            class="statusinprogress"
                          >
                            Inprogress
                          </v-btn>
                        </td>
                        <td v-if="item.task_status == 3">
                          <v-btn
                            outlined
                            rounded
                            color="white"
                            width="80px"
                            height="30px"
                            class="statusresolved"
                          >
                            Resolved
                          </v-btn>
                        </td>
                        <td v-if="item.task_status == 4">
                          <v-btn
                            outlined
                            rounded
                            color="white"
                            width="80px"
                            height="30px"
                            class="statusclosed"
                          >
                            Closed
                          </v-btn>
                        </td>
                      </template>

                      <!-- PRIORITY STATUS COLUMN -->
                      <template v-slot:[`item.priority`]="{ item }">
                        <td v-if="item.priority == 3">
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon v-bind="attrs" v-on="on" color="red"
                                >mdi-arrow-up</v-icon
                              >
                            </template>
                            <span>High</span>
                          </v-tooltip>
                        </td>
                        <td v-if="item.priority == 2">
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon v-bind="attrs" v-on="on" color="#4622bd"
                                >mdi-arrow-right</v-icon
                              >
                            </template>
                            <span>Normal</span>
                          </v-tooltip>
                        </td>
                        <td v-if="item.priority == 1">
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon v-bind="attrs" v-on="on" color="green"
                                >mdi-arrow-down</v-icon
                              >
                            </template>
                            <span>Low</span>
                          </v-tooltip>
                        </td>
                      </template>

                      <template v-slot:[`item.start_date`]="{ item }"
                        ><td>
                          {{ item.start_date }}
                        </td></template
                      >
                      <template v-slot:[`item.end_date`]="{ item }"
                        ><td>
                          {{ item.end_date }}
                        </td></template
                      >
                      <template v-slot:[`item.Status`]>
                        <v-chip color="error" outlined> closed </v-chip>
                      </template>

                      <!------------------------------------------------ ------------------------------------------------------------>
                      <template v-slot:[`item.action`]="{ item }">
                        <v-row>
                          <v-icon color="black" @click="openModal(item.task_id)"
                            >mdi-paperclip</v-icon
                          >
                        </v-row>
                      </template>

                      <!-------------------------------------------------------------------------------------------------------------------------------->
                    </v-data-table>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!--------------------------------preview modal------------------------------------------------------->
        <v-dialog
          v-model="previewDialog"
          persistent
          max-width="1000"
          max-hight="70%"
          id="previewDialogModal"
        >
          <v-card v-if="previewDialog">
            <div id="title">
              <v-card-title>
                <span class="text-h5">Task Preview</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog" dark>
                  <v-icon> mdi-close </v-icon>
                </v-btn>
              </v-card-title>
            </div>
            <br />
            <v-card-text>
              <v-container>
                <update-dialog
                  :Update_tid="Update_tid"
                  :project_Id="project_Id"
                  @close="getValue"
                />
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
window.addEventListener("beforeunload", function () {
  localStorage.removeItem("search");
});

import sideNavigation from "../AdminPage/Notification/sideBarr.vue";

import topNavigation from "./adminTopNav.vue";
import ApiService from "../../service/apiservice.js";
import loader from "./Loader/loaderView.vue";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
import UpdateDialog from "./updateDialog.vue";

let moment = require("moment");
Vue.use(VueToast);

export default {
  components: { sideNavigation, topNavigation, UpdateDialog, loader },

  data() {
    return {
      category_dummy: { category_id: null, category: "No Category" },
      assignee_dummy: { user_id: null, user_name: "Unassigned" },
      userlist_forassignee: [],
      user_list: [],
      all: true,
      project_Id: "",
      none:null,
      open: false,
      inprogress: false,
      resolved: false,
      closed: false,
      loaderValue: false,

      moment: moment,
      momentt: moment,
      search: true,
      advanced: false,
      viewDialog: false,
      general: true,
      datesearch: false,
      noChild: [1, 2],
      selectedItem: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu: false,
      menu1: false,
      menu3: false,
      menu2: false,

      modal: false,
      taskCount: "",
      t_status: [
        { name: "Open", id: 1 },
        { name: "In-progress", id: 2 },
        { name: "Resolved", id: 3 },
        { name: "Closed", id: 4 },
      ],

      t_priority: [
        { name: "Low", id: 1 },
        { name: "Normal", id: 2 },
        { name: "High", id: 3 },
      ],

      adv_general: {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        start_date_from_date: "",
        start_date_to_date: "",
        due_date_from_date: "",
        due_date_to_date: "",
        keyword: "",
      },

      category: [
        { value: "1", text: "closed" },
        { value: "2", text: "open" },
        { value: "3", text: "Client" },
      ],
      priority: [
        { value: "1", text: "Normal" },
        { value: "2", text: "High" },
        { value: "3", text: "Low" },
      ],
      role: "",
      dialog: false,
      isValid: false,
      valid: true,
      task_count: "",
      Update_tid: "",
      UserAllocationModal: false,
      ProjectList: [],
      category_id: [],
      ProjectData: [],
      previewDialog: false,

      project: {
        project_id: "",
      },

      pagination: {
        pageCount: "",
        pageNumberCount: 1,
      },
      category_list: [],
      flag: undefined,
      searchFlag: undefined,
      searchResult: "",
      searchKey: "",
      btnvalid: false,
      seletcitem: false,
      selecteddata: false,
      selectedHeaders: [],
      headers: [],
      headersMap: [
        {
          text: "Issue Type",
          value: "task_issue.issue_name",
          sortable: false,
          align: "start",
        },
        {
          text: "Key",

          sortable: false,
          value: "task_id",
        },
        { text: "Subject", value: "task_name", sortable: false, width: "15%" },
        { text: "Preview", value: "actions", sortable: false, width: "3%" ,  },

        {
          text: "Assignee",
          value: "assignee.user_name",
          sortable: false,
          width: "10%",
        },

        { text: "Status", value: "task_status", sortable: false, width: "3%" },
        {
          text: "Category",
          value: "task_category.category_name",
          sortable: false,
        },

        { text: "Priority", value: "priority", sortable: false, width: "3%" },
        {
          text: "Created By",
          value: "created_by.user_name",
          sortable: false,
          width: "10%",
        },
        { text: "Start Date", value: "start_date", sortable: false },
        { text: "End Date", value: "end_date", sortable: false },

        { text: "Action", value: "action", sortable: false, width: "2%" },
      ],
      task_list: { task: [], loading: false },

      data: {
        error: [],
        user_name: "",
        email: "",
        category: "",
        designation: "",
        selected: "Select",
      },

      normalSearch: {
        status: "",
        subtasking: "",
        keyWord: "",
      },

      nameRules: [(v) => !!v || "Name is required"],

      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) =>
          /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "E-mail must be valid",
      ],
      typesRules: [(v) => !!v || "User type is required"],
      designationRules: [(v) => !!v || "Department Id is required"],
    };
  },

  methods: {
    async getUser() {
      const id = this.projectId;
      const data = {};
      const response = await ApiService(
        "project/Usersprojects/" + id,
        "Post",
        data
      );
      this.user_list = response?.listView;
      let newArray = this.user_list.slice(); // Create a copy of the original array
      newArray.unshift(this.assignee_dummy);
      this.userlist_forassignee = newArray;
    },

    toggleSearch() {
      localStorage.setItem("searchType", 1);
    },

    toggleSearch2() {
      localStorage.setItem("searchType", 2);
    },

    async getIssueType() {
      try {
        const response = await ApiService("/task/getIssue", "GET");

        if (response.length !== 0) {
          this.issue_list = response?.issueTotalList;
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    unSelectItem(item) {
      console.log(item);
      this.selectedItem = false;
    },
    async getCategory() {
      try {
        const response = await ApiService("/task/getcategory", "GET");

        if (response.length !== 0) {
          this.category_list = response?.categoryTotalList;
          let newArray = this.category_list.slice();
          newArray.unshift(this.category_dummy);
          this.category_list = newArray;
          this.categorylist();
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    previewModal(id) {
      this.project_Id = this.projectId;
      this.Update_tid = id;

      this.previewDialog = true;
    },
    closeDialog() {
      this.previewDialog = false;
    },

    getValue(value) {
      this.getTask(1);
      this.previewDialog = false;
      console.log(value);
    },
    ClrSelect() {
      localStorage.removeItem("search");

      this.getTask(1);
    },
    selectStatus(id) {
      if (!this.adv_general.task_status?.includes(id)) {
        this.adv_general.task_status.push(id);
      } else {
        this.adv_general.task_status?.map((item, index) => {
          if (item == id) {
            this.adv_general.task_status?.splice(index, 1);
          }
        });
      }
    },

    selectpriority(id) {
      if (!this.adv_general.priority?.includes(id)) {
        this.adv_general.priority.push(id);
      } else {
        this.adv_general.priority?.map((item, index) => {
          if (item == id) {
            this.adv_general.priority?.splice(index, 1);
          }
        });
      }
    },
    selectAssignee(id) {
      if (!this.adv_general.assigne?.includes(id)) {
        this.adv_general.assigne.push(id);
      } else {
        this.adv_general.assigne?.map((item, index) => {
          if (item == id) {
            this.adv_general.assigne?.splice(index, 1);
          }
        });
      }
    },
    selectCategory(id) {
      if (!this.adv_general.category?.includes(id)) {
        this.adv_general.category.push(id);
      } else {
        this.adv_general.category?.map((item, index) => {
          if (item == id) {
            this.adv_general.category?.splice(index, 1);
          }
        });
      }
    },
    selectCreatedby(id) {
      if (!this.adv_general.createdBy?.includes(id)) {
        this.adv_general.createdBy.push(id);
      } else {
        this.adv_general.createdBy?.map((item, index) => {
          if (item == id) {
            this.adv_general.createdBy?.splice(index, 1);
          }
        });
      }
    },
    selectRelation(id) {
      if (!this.adv_general.relation?.includes(id)) {
        this.adv_general.relation = id;
      } else {
        this.adv_general.relation?.map((item, index) => {
          if (item == id) {
            this.adv_general.relation?.splice(index, 1);
          }
        });
      }
    },
    selectIssuetype(id) {
      if (!this.adv_general.issue_type?.includes(id)) {
        this.adv_general.issue_type.push(id);
      } else {
        this.adv_general.issue_type?.map((item, index) => {
          if (item == id) {
            this.adv_general.issue_type?.splice(index, 1);
          }
        });
      }
    },

    async advancedSearch() {
      try {
        localStorage.setItem(
          "advanced_status",
          JSON.stringify(this.adv_general.task_status)
        );
        localStorage.setItem(
          "advanced_priority",
          JSON.stringify(this.adv_general.priority)
        );
        localStorage.setItem(
          "advanced_category",
          JSON.stringify(this.adv_general.category)
        );
        localStorage.setItem(
          "advanced_issue_type",
          JSON.stringify(this.adv_general.issue_type)
        );
        localStorage.setItem(
          "advanced_assigne",
          JSON.stringify(this.adv_general.assigne)
        );
        localStorage.setItem(
          "advanced_createdBy",
          JSON.stringify(this.adv_general.createdBy)
        );
        localStorage.setItem(
          "advanced_relation",
          JSON.stringify(this.adv_general.relation)
        );
        localStorage.setItem(
          "advanced_due_date_from_date",
          this.adv_general.due_date_from_date
        );
        localStorage.setItem(
          "advanced_due_date_to_date",
          this.adv_general.due_date_to_date
        );
        localStorage.setItem(
          "advanced_start_date_from_date",
          this.adv_general.start_date_from_date
        );
        localStorage.setItem(
          "advanced_start_date_to_date",
          this.adv_general.start_date_to_date
        );
        const id = this.projectId;
        const response = await ApiService(
          "/task/advancedsearch/" + id,
          "POST",
          this.adv_general
        );
        this.task_list = { task: response?.data };
        this.taskCount = { task: response?.dataCount };
      } catch (error) {
        console.log(error);
      }
    },

    async searchTask() {
      localStorage.setItem("search", this.normalSearch.keyWord);

      try {
        const id = this.projectId;
        const response = await ApiService(
          "/task/tasklist/" + id,
          "POST",
          this.normalSearch
        );

        localStorage.removeItem(this.search);

        this.task_list = { task: response?.data };
        console.log(this.task_list, "task list");

        if (this.task_list.length == 0) {
          this.footerHide = true;
        } else {
          this.footerHide = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    openView() {
      this.viewDialog = true;
    },
    closeView() {
      this.viewDialog = false;
    },
    async getProjectDetails() {
      try {
        this.loaderValue = false;
        const id = this.projectId;
        const response = await ApiService(
          "/project/overallProjectStatus/" + id,
          "GET"
        );
        this.loaderValue = true;

        if (response.statusCode == 50) {
          this.$router.push("/dashboard");
        }
        this.ProjectData = response;
      } catch (error) {
        console.log(error);
      }
    },
    async display(item) {
      this.selecteddata = item;
    },
    async removedisplay() {
      this.selecteddata = false;
    },
    async getProjectsList() {
      try {
        const response = await ApiService("/ ", "GET");
        this.ProjectList = response.rows;
      } catch (error) {
        console.log(error);
      }
    },

    // <!------------------------------------------get user-------------------------------------------------->
    async getTask(id) {
      this.loaderValue = false;

      this.normalSearch.status = id;
      localStorage.setItem("Status", this.normalSearch.status);
      if (id == 1) {
        this.all = true;
        this.open = false;
        this.inprogress = false;
        this.resolved = false;
        this.closed = false;
      } else if (id == 2) {
        this.all = false;
        this.open = true;
        this.inprogress = false;
        this.resolved = false;
        this.closed = false;
      } else if (id == 3) {
        this.all = false;
        this.open = false;
        this.inprogress = true;
        this.resolved = false;
        this.closed = false;
      } else if (id == 4) {
        this.all = false;
        this.open = false;
        this.inprogress = false;
        this.resolved = true;
        this.closed = false;
      } else if (id == 5) {
        this.all = false;
        this.open = false;
        this.inprogress = false;
        this.resolved = false;
        this.closed = true;
      }
      try {
        this.normalSearch.keyWord = localStorage.getItem("search");
        localStorage.removeItem("search");

        const params = { limit: 1000 };

        const pid = this.projectId;
        const response = await ApiService(
          "/task/tasklist/" + pid,
          "POST",
          this.normalSearch,
          null,
          params
        );
        this.loaderValue = true;

        localStorage.removeItem(this.search);
        this.task_list = { task: response?.data };

        this.handlePageChange();
      } catch (error) {
        console.log(error);
      }
    },

    async getsubTask(id) {
      this.normalSearch.subtasking = id;
      localStorage.setItem("Subtask", this.normalSearch.subtasking);
      if (id == 1) {
        this.allsub = true;
        this.parent = false;
        this.excludechild = false;
      } else if (id == 2) {
        this.allsub = false;
        this.parent = true;
        this.excludechild = false;
      } else if (id == 3) {
        this.allsub = false;
        this.parent = false;
        this.excludechild = true;
      }
      try {
        const projectId = this.projectId;
        const response = await ApiService(
          "/task/tasklist/" + projectId,
          "POST",
          this.normalSearch
        );

        this.task_list = { task: response?.data };
        this.task_count = this.task_list?.taskCount;

        this.handlePageChange();
      } catch (error) {
        console.log(error);
      }
    },

    // <!-------------------------usertype covertion--------------------------------------->
    findUsertype(value) {
      if (value === 0) {
        return "bug";
      }
      const category = this.category.find((data) => data?.value == value);
      return category?.text;
    },

    //-------------------------pagination---------------------------------------------------------
    findPageNumberCount(totalCount, pageSize) {
      if (totalCount && pageSize) {
        return 2;
      }
    },

    handlePageSizeChange(pageNumber) {
      const params = {
        page: pageNumber,
        limit: this.pagination.limit,
        searchKey2: this.projectId,
      };
      this.pagination.page = pageNumber;
      this.getTask(params);
    },

    handlePageChange() {
      this.pagination.pageNumberCount = Math.ceil(
        this.pagination.pageCount / this.pagination.limit
      );
    },

    openModal(uid) {
      this.confirmation = true;

      this.task_id = uid;
    },

    onClose() {
      this.confirmation = false;
      this.Re_confirmation = false;

      this.task_id = null;
    },
    handleClick(category) {
      const TaskId = category.task_id;
      localStorage.setItem("TaskId", TaskId);
      this.$store.commit("getTaskData", TaskId);

      this.$router.push("/task-view");
    },
    truncate(str, length) {
      if (str.length > length) {
        return str.substring(0, length) + "...";
      } else {
        return str;
      }
    },
   

    clearSelection() {
      this.selectedValue = null;
    },

    // side bar toggle
    ToggleOnOff(msg) {
      this.boxs = document.getElementById("boxs");
     
      if (msg) {
        if(this.boxs && this.boxs.style && this.boxs.style.marginLeft) this.boxs.style.marginLeft = "220px";
        if(this.boxs && this.boxs.style && this.boxs.style.transition) this.boxs.style.transition = "visibility 0s, opacity 0.5s linear";
      } else {
        if(this.boxs && this.boxs.style && this.boxs.style.marginLeft) this.boxs.style.marginLeft = "64px";
        if(this.boxs && this.boxs.style && this.boxs.style.transition) this.boxs.style.transition = "visibility 0s, opacity 0.5s linear";
      }
    },
    openBatch() {
      if (this.task_list.taskCount == 0) {
        this.valid = false;
      } else {
        this.valid = true;

        this.$router.push("/batch-update");
      }
    },
  },

  //----------------------------------------------watch func for pagination----------------------------------------------------------------
  watch: {
    "pagination.limit": function () {
      this.getUser();
    },

    searchKey: function () {
      this.searchQuestion();
    },

    //---------------------------------remove data from the form after sumbmit----------------------------------------------------------
    dialog: function (val) {
      if (val) {
        this.data.user_name = "";
        this.data.email = "";
        this.data.user_type = "";
        this.data.designation = "";
      }
    },
  },

  created() {
    this.headers = Object.values(this.headersMap);
    this.selectedHeaders = this.headers;
  },
  computed: {
    showHeaders() {
      return this.headers.filter((s) => this.selectedHeaders.includes(s));
    },
    assignee() {
      let datavlues = [];
      this.user_list?.map((data) => {
        datavlues.push({
          value: data?.user?.user_id,
          text: data?.user?.user_name,
        });
      });

      console.log(this.user_list, "opts.................");

      return datavlues;
    },
    getUserId(name) {
      let id = 0;
      this.user_list?.map((data) => {
        if (name == data?.user?.user_name) {
          id = data?.user?.user_id;
        }
      });
      return id;
    },
  },

  mounted() {
    localStorage.setItem("searchType", 2);
    this.projectId = this.$store.state.projectId;
    if (this.projectId === "null") {
      this.$router.push("/dashboard");
    }
    localStorage.setItem("projectId", this.projectId);
    this.getUser();
    this.getIssueType();
    this.getCategory();
    this.ToggleOnOff(localStorage.getItem("is_expanded") === "true");

    this.getTask(localStorage.getItem("filter"));
  },

  beforeMount() {
   
    this.projectId = this.$store.state.projectId;

    localStorage.setItem("projectId", this.projectId);
    this.getProjectDetails();
  },
};
</script>

<style scoped>
#title {
  background-color: #4fa5d6;
  color: #fff;
}
#imp {
  color: red;
}
.v-text-field {
  height: 20%;
}
.label {
  font-size: medium;
}
@media (max-width: 480px) {
  .searchBar {
    margin-right: -80%;
  }
}

tr:hover .actionButtons {
  visibility: visible;
}

.hiHover span {
  color: rgba(255, 255, 255, 0);
  height: 50px;
  width: 100px;
}
.hiHover span:hover {
  color: rgba(255, 255, 255, 0);
}

.general {
  width: 97%;
  height: 20%;
  box-sizing: border-box;
  border: 1px solid black;
  display: flex;
}
.date {
  padding: 2%;
  width: 97%;
  height: 20%;
  box-sizing: border-box;
  border: 1px solid black;
  display: flex;
}

.statusFlex {
  display: flex;
  flex-wrap: wrap;
  margin-right: 0%;
  margin-bottom: 2%;
}
.buttons {
  display: flex;
  gap: 10px;

  margin-top: 3%;
}
.buttonsThree {
  display: flex;
  justify-content: end;

  position: sticky;
}
.viewoptions {
  flex: auto !important;
  max-width: 25% ;
}
div.v-input--is-label-active:nth-child(2) {
  width: auto !important;
}
div.v-select__slot:nth-child(2) {
  width: auto !important;
}
.v-select__slot {
  position: relative;
  align-items: center;
  display: flex;
}

.v-application .caption {
  font-size: 10px !important;
  font-weight: 400;
  letter-spacing: 0.0333333333em !important;
  line-height: 1.25rem;
  font-family: "Roboto", sans-serif !important;
}

.select-container {
  position: absolute;
  right: 0;
  top: 0;
  width: 200px;
  zoom: 1;
}
.subTasking {
  display: flex;
  margin-top: 3%;
  margin-left: 5%;
  gap: 10px;
 
}
.buttonsTwo {
  display: flex;
  gap: 10px;
}

#minHeight {
  min-height: 208px;
  overflow-y: scroll;
}
#maxHeight {
  height: auto;
  overflow-y: scroll;
}
#maxAuto {
  max-height: 208px;
}
#Selectarea {
  max-width: 27% !important;
  max-height: 40px;
}
.adavancesearchtoggle {
  display: flex;
    justify-content: center;
}
#HeaderTask {
  max-height: 57px;
}
#searchBarIconsTask1 {
  display: flex;
  justify-content: end;
  margin-top: -50px;
}
@media only screen and (max-width: 1450px) {
  .logo {
    width: 40px;
    margin-left: -18%;

  }

  .names {
    font-size: 15px;
    margin-top: -29px;
  }
}

.normalfilterbtn {
  margin-right: 2%;
  font-size: 12px;
  text-transform: none;
}
.names {
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  margin-top: -9px;
}
.issue1 {
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: #e64754;
}
.issue2 {
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: #478af5;
}
.issue3 {
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: #21c241;
}
.issue4 {
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: #d9991a;
}

.batchUpdate {
  margin-right: 10px;
  text-decoration: none;
}
.statusOpen {
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: #ed8077;
}
.statusinprogress {
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: #4488c5;
}
.statusresolved {
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: #5eb5a6;
}
.statusclosed {
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: #a1af2f;
}

.fixed-sidebar .app-main .app-main__outer {
  z-index: 9;
  margin-left: 220px;
  padding-left: 0px;
}

.text-truncate {
  border-radius: 15px;
  padding: 4px;

  padding-left: 19px;
  padding-right: 18px;
  line-height: 21px;
  text-align: center !important;
  margin-block: 6px;
  height: 30px;
  width: 100px;
  border: none;
  font-weight: 500;
  font-size: 12px;
  text-transform: none;
  background-color: plum !important;

  color: #fff;
}

.togglesearch {
  width: 160px;
  height: 40px !important;
}

.Toptitle {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
  background-color: #fff !important;
}

.firstrowsearch {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.seconddivSearch {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.searchbtnAdvanced {
  justify-content: center;
  margin-top: 2%;
}
.datesearch {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}


@media screen and (max-width: 991px) {
  .adavancesearchtoggle {
    margin-top: 80px;
  }
  #searchBarIconsTask1 {
    margin-top: 0 !important;
  }
  #formSearch {
    width: 45%;
  }
  .buttonsTwo {
    gap: 10px;
   
  }
 

  .subTasking {
  display: flex;
  margin-top: 3%;
  margin-left: 0%;
  gap: 10px;
 
}
  .statusFlex {
  display: flex;
  flex-wrap: wrap;
  margin-right: 0%;
  margin-bottom: 2%;
}
  .buttonsThree {
    margin-top: 10%;
    display: flex;
    flex-wrap: wrap;

    gap: 20px;
    width: 100%;
    justify-content: flex-start;
    position: sticky;
  }
  .viewoptions {
    flex: auto !important;
    max-width: 100% ;
  }
  .firstrowsearch {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .seconddivSearch {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .adavancedsearchDiv {
    margin-top: 10%;
  }
  .searchbtnAdvanced {
    margin-top: 3%;
  }
  .datesearch {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }

}
.categoriess {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
@media (max-width: 991.98px) {

 
}
#searchTask {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  margin-top: 0px;
}
.app-page-title .page-title-heading {
  margin-bottom: 25px;
}
@media (max-width: 991.98px) {
  .app-page-title .page-title-heading,
  .app-page-title .page-title-wrapper {
    margin: 0 ;
    display: flex ;
    flex-wrap: wrap ;
  }
}
@media screen and (max-width: 991px) {

  .statusFlex {
  display: flex;
  flex-wrap: wrap;
  margin-right: 0%;
  margin-bottom: 2%;
}
#searchTask {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  margin-top: 40px;
}

.names {
    font-size: 14px;
    white-space: nowrap;
    width: 700px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: -7px;
  }
}

@media screen and (max-width:700px) {
.buttons{
  display: flex;
  flex-wrap: wrap;
}

  .buttonsTwo{
  display: flex;
  flex-wrap: wrap;
}
.subTasking {
  display: flex;
  flex-wrap: wrap;
  margin-top: 3%;
  margin-left: -1%;
  gap: 10px;
 
}

.names {
    font-size: 14px;
    white-space: nowrap;
    width: 300px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: -7px;
  }

#formSearch {
    width: 45%;
  }
}

@media screen and (max-width:500px) {
  #formSearch {
    width: 100%;
  }
  .viewoptions {
   display: none;
  }

}


@media screen and (max-width:1100px){
  .app-main .app-main__inner{
    background: #f1f4f6;
  }
}

@media (max-width: 280px) {
  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 200px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: -7px;
  }
}
</style>
