<template>
  <div class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
    <!-- top nav -->
    <topNavigation />

    <div class="app-main">
      <!-- side nav -->
      <div class="SidebarHome">
      <sideNavigation :id="ProjectData.project_id" @SideBarToggle="ToggleOnOff" />
    </div>
      <div class="app-main__outer neww" id="boxs" v-bind:style="{'margin-left': '64px', 'transition': none}">
        <div class="app-main__inner">
          <div v-if="!loaderValue">
            <loader />
          </div>
          <div v-if="loaderValue">
            <div class="app-page-title bg-light p-1 titleBox Toptitle">
              <div class="page-title-wrapper" id="pageTitle">
                <div class="page-title-heading">
                  <router-link :to="'/home'" style="background: none">
                    <v-img
                      class="logo"
                      src="../../assets/Images/logo.png"
                      alt="logo"
                    ></v-img
                  ></router-link>
                  <div
                    class="names"
                    :title="`${projectStatus.project_name} (${projectStatus.project_code})`"
                  >
                    {{ projectStatus.project_name }} ( {{ projectStatus.project_code }})
                  </div>
                </div>
                <v-spacer></v-spacer>
                <!-------------------------------list members-------------------------------------->
                <div id="margin" class="searchBoxAll">
                  <template>
                    <v-row justify="center">
                      <v-dialog v-model="dialogCompose" scrollable max-width="800px">
                        <template v-slot:activator="{ on, attrs }">
                          <div id="BlockSearch">
                            <v-avatar
                              id="icons"
                              size="40"
                              color="primary"
                              v-bind="attrs"
                              title="members"
                              v-on="on"
                              @click="getAllocatedUser()"
                            >
                              <v-icon style="color: aliceblue"
                                >mdi-account-multiple</v-icon
                              >
                            </v-avatar>

                            <v-form
                              id="searching"
                              class="search"
                              action=""
                              @submit.prevent="searchQuestion()"
                            >
                              <v-text-field
                                autocomplete
                                @keyup.enter="searchQuestion()"
                                v-model="searchText"
                                dense
                                outlined
                                rounded
                                clearable
                                placeholder="Search Task"
                                prepend-inner-icon="mdi-magnify"
                                class="pt-6 shrink expanding-search"
                                :class="{ closed: searchBoxClosed && !searchText }"
                              ></v-text-field>
                            </v-form>
                          </div>
                        </template>

                        <v-card>
                          <v-toolbar flat color="#4FA5D6" scrollable>
                            <v-toolbar-title style="color: white; font-size: medium">
                              Project Members
                            </v-toolbar-title>

                            <v-spacer></v-spacer>
                            <v-form
                              class="srch"
                              action=""
                              @submit.prevent="getAllocatedUser()"
                            >
                              <v-text-field
                                id="searching"
                                autocomplete
                                @keyup="getAllocatedUser()"
                                v-model="searchProject"
                                dense
                                filled
                                background-color="white"
                                rounded
                                clearable
                                @click:clear="setItNull()"
                                placeholder="Search members "
                                prepend-inner-icon="mdi-magnify"
                                class="pt-6 shrink expanding-search"
                                :class="{
                                  closed: searchBoxClosed && !searchProject,
                                }"
                              ></v-text-field>
                            </v-form>
                            <v-spacer></v-spacer>

                            <v-btn icon @click="closeDialog()" dark>
                              <v-icon> mdi-close </v-icon>
                            </v-btn>
                          </v-toolbar><br/>

                          <v-card-text style="height: 300px">
                            <div class="card cardMsg mb-3 widget-content" id="memberlist">
                              <div class="table-responsive">
                                <v-container>
                                 
                                  <v-data-table
                                  :mobile-breakpoint="100"
                                    :headers="headersNew"
                                    :items="user_list"
                                    :hide-default-header="true"
                                    :hide-default-footer="footerHide"
                                    class="custom_table_class"
                                    :group-desc="true"
                                    :page.sync="pagination"
                                    :items-per-page.sync="limit"
                                    :server-items-length="totalUsers"
                                  >
                                    <template v-slot:[`item.profile_photo`]="{ item }">
                                      <td>
                                        <div v-if="item.user.profile_photo !== null">
                                          <img
                                            width="30"
                                            height="30"
                                            class="rounded-circle responsive-img"
                                            v-bind:src="item.user.profile_photo"
                                            loading="lazy"
                                            alt=""
                                            title="Profile"
                                          />
                                        </div>

                                        <div v-if="item.user.profile_photo == null">
                                          <img
                                            width="30"
                                            height="30"
                                            class="rounded-circle"
                                            src="../../assets/Images/profilePicc.jpg"
                                            alt=""
                                            title="Profile"
                                          />
                                        </div>
                                      </td>
                                    </template>

                                    <template v-slot:[`item.last_active`]="{ item }">
                                      <div :class="getStyle(item.last_active)">
                                        {{
                                          item.last_active != null
                                            ? moment(item.last_active).fromNow()
                                            : "-"
                                        }}
                                      </div>
                                    </template>
                                  </v-data-table>
                               
                                </v-container>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-row>
                  </template>
                </div>
                <!------------------------------------------------------------------------>
              </div>
            </div>
            <h5 id="f1">
              <v-row class="align_row">
                Project Home :
                <span id="f2" test-data="id1">Recent Updates </span></v-row
              >

              <v-row >
                <v-dialog v-model="dialog" persistent max-width="400">
                  <template v-slot:activator="{ on, attrs }">
                    <div id="rows">
                      <v-btn
                        outlined
                        rounded
                        color="black"
                        width="120px"
                        height="30px"
                        v-bind="attrs"
                        v-on="on"
                        title="View Options"
                        style="
                          margin-left: 23%;

                          min-height: 10px;
                          min-width: 60px;
                          font-size: 12px;
                          text-transform: none;
                        "
                        class="chipset2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"
                          ></path>
                        </svg>

                        View options
                      </v-btn>
                    </div>
                  </template>
                  <v-card>
                    <v-toolbar style="height: 44px" flat color="#4FA5D6" scrollable>
                      <v-toolbar-title
                        style="color: white; size: 2%; margin-top: -5%; font-size: large"
                      >
                        View Options
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn style="margin-top: -5%" icon @click="dialog = false" dark>
                        <v-icon> mdi-close </v-icon>
                      </v-btn>
                    </v-toolbar>

                    <h6 style="margin-left: 5%; margin-top: 2%">Filter</h6>
                    <v-card-text>
                      <v-container fluid>
                        <v-row>
                          <v-col cols="12" sm="4" md="4" class="check">
                            <v-checkbox
                              v-model="filterArrays"
                              label="Tasks"
                              color="#4FA5D6"
                              value="1"
                              hide-details
                            ></v-checkbox>
                            <v-checkbox
                              v-model="filterArrays"
                              label="Projects"
                              color="#4FA5D6"
                              value="2"
                              hide-details
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions class="alignbtn">
                      <v-btn
                        id="btnshadow"
                        color="#4fa5h6"
                        class="cmnbtnstyle"
                        style="margin-left: 0%"
                        @click="dialog = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        id="btnshadow"
                        class="cmnbtnstyle"
                        color="#4fa5d6"
                        style="margin-right: 30 %"
                        @click="optionUpdated()"
                      >
                        save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
            </h5>

            <div class="row" id="forFlex1">
              <div class="flex1">
           
              

                  <div v-for="(group,firstIndex) in activity" :key="group.id">
                    <div class="card-header-tab card-header">
                <div class="card-header-title">
                  <em
                    class="header-icon lnr-rocket icon-gradient bg-tempting-azure"
                  >
                  </em>
                  {{ new Date(group.date).toDateString()}}                </div>


              </div>
                  <div v-for="(Data, index) in group.data" :key="Data.id">
                    <div class="card cardMsg widget-content recentCard">
                      <div class="widget-content-outer">
                        <div class="widget-content-wrapper" style="margin-top: -15px">
                          <div class="widget-content-left" v-if="Data.action == 1">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="error"
                                content="Deleted"
                                left
                                inline
                              ></v-badge>
                              a task
                            </div>

                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>

                          <div class="widget-content-left" v-if="Data.action == 2">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="primary"
                                content="Created"
                                left
                                inline
                              ></v-badge>
                              a new task
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                            <div></div>
                          </div>
                          <div class="widget-content-left" v-if="Data.action == 3">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="primary"
                                content="Updated"
                                left
                                inline
                              ></v-badge>
                              a new task
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>

                          <div class="widget-content-left" v-if="Data.action == 4">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="success"
                                content=" Uploaded"
                                left
                                inline
                              ></v-badge>
                              a file
                            </div>

                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>
                          <div class="widget-content-left" v-if="Data.action == 5">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="warning"
                                content=" Assigned"
                                left
                                inline
                              ></v-badge>
                              a file
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>
                          <div class="widget-content-left" v-if="Data.action == 6">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="warning"
                                content=" Re-Assigned"
                                left
                                inline
                              ></v-badge>
                              a Task
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>
                          <div class="widget-content-left" v-if="Data.action == 7">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="primary"
                                content=" Created  "
                                left
                                inline
                              ></v-badge
                              >and
                              <v-badge
                                color="warning"
                                content="Assigned"
                                left
                                inline
                              ></v-badge>
                              a Task
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>
                          <div class="widget-content-left" v-if="Data.action == 8">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="primary"
                                content=" Changed  "
                                left
                                inline
                              ></v-badge>
                              Task status
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>
                          <div class="widget-content-left" v-if="Data.action == 9">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="primary"
                                content="Updated"
                                left
                                inline
                              ></v-badge
                              >and
                              <v-badge
                                color="warning"
                                content="Re-Assign"
                                left
                                inline
                              ></v-badge>
                              Task status
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>
                          <div class="widget-content-left" v-if="Data.action == 10">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              added a
                              <v-badge
                                color="primary"
                                content="Comment"
                                left
                                inline
                              ></v-badge>
                            </div>
                            <router-link :to="'/task-view'" class="navPage">
                              <div
                                class="Taskname newClass"
                                @click="TaskRedirect(Data.project_id, Data.task_id)"
                              >
                                [Task Name: {{ Data.task_name }} ]
                              </div>
                            </router-link>
                            <div style="margin-bottom: 0px" class="newClass">
                              <tr>
                                <td>Comment- &nbsp;</td>
                                <td
                                  id="idd"
                                  class="commentBox"
                                  v-html="convertToBlue(Data.comment)"
                                ></td>
                              </tr>
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>
                          <div class="widget-content-left" v-if="Data.action == 11">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="primary"
                                content="Updated"
                                left
                                inline
                              ></v-badge
                              >Changed status
                              <v-badge
                                color="warning"
                                content="Re-Assign"
                                left
                                inline
                              ></v-badge>
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>

                          <div class="widget-content-left" v-if="Data.action == 12">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="primary"
                                content="Updated"
                                left
                                inline
                              ></v-badge
                              >Changed assignee
                              <v-badge
                                color="warning"
                                content="Re-Assign"
                                left
                                inline
                              ></v-badge>
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>

                          <div class="widget-content-left" v-if="Data.action == 13">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="primary"
                                content="Updated"
                                left
                                inline
                              ></v-badge
                              >Changed status And Assignee
                              <v-badge
                                color="warning"
                                content="Re-Assign"
                                left
                                inline
                              ></v-badge>
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>
                          <div class="widget-content-left" v-if="Data.action == 14">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              <v-badge
                                color="primary"
                                content="Updated"
                                left
                                inline
                              ></v-badge
                              >File renamed
                              <v-badge
                                color="warning"
                                content="Re-Assign"
                                left
                                inline
                              ></v-badge>
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>

                          <div class="widget-content-left" v-if="Data.action == 20">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                v-bind:src="Data.profile_photo"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              Edited the
                              <v-badge
                                color="pink accent-3"
                                content="Members"
                                left
                                inline
                              ></v-badge
                              >Of the project
                            </div>
                            <router-link :to="'/home'" class="navPage">
                              <div class="widget-subheading projectName newClass">
                                {{ Data.project_name }}({{ Data.project_code }})
                              </div>
                            </router-link>

                            <div class="widget-subheading newClass">
                              {{ Data.allocated_user_name }} has been added as a
                              {{ Data.allocated_role_name }}
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>

                          <div class="widget-content-left" v-if="Data.action == 21">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              Edited the
                              <v-badge
                                color="pink accent-3"
                                content="Members"
                                left
                                inline
                              ></v-badge
                              >Of the project
                            </div>
                            <div
                              class="widget-subheading newClass"
                              style="font-weight: bold"
                            >
                              {{ Data.project_name }}({{ Data.project_code }})
                            </div>
                            <div class="widget-subheading newClass">
                              {{ Data.allocated_user_name }} has been added as a
                              {{ Data.allocated_role_name }}
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>
                          <div class="widget-content-left" v-if="Data.action == 24">
                            <div v-if="Data.profile_photo !== null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle responsive-img ImageProfile"
                                v-bind:src="Data.profile_photo"
                                loading="lazy"
                                alt=""
                                title="Profile"
                              />
                            </div>

                            <div v-if="Data.profile_photo == null">
                              <img
                                width="30"
                                height="30"
                                class="rounded-circle ImageProfile"
                                src="../../assets/Images/profilePicc.jpg"
                                alt=""
                                title="Profile"
                              />
                            </div>
                            <div class="widget-heading headingContent">
                              {{ Data.action_by }}
                              Edited the
                              <v-badge
                                color="pink accent-3"
                                content="Members"
                                left
                                inline
                              ></v-badge
                              >Of the project
                            </div>
                            <router-link :to="'/home'" class="navPage">
                              <div class="projectName newClass">
                                {{ Data.project_name }}({{ Data.project_code }})
                              </div>
                            </router-link>
                            <div class="widget-subheading newClass">
                              {{ Data.allocated_user_name }} removed from the project
                            </div>
                            <div class="widget-subheading newClass">
                              {{ moment(Data.created_date).fromNow() }}
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="
                            Data.action !== 20 &&
                            Data.action !== 24 &&
                            Data.action !== 1 &&
                            Data.status !== 0
                          "
                        >
                          <div class="msg-icon" v-on="on">
                            <v-icon @click="openText(Data.task_history_id, index)">
                              mdi-message-processing</v-icon
                            >
                          </div>
                        </div>
                        <div class="textarea">
                          <div v-show="openStates[Data.task_history_id]">
                            <v-form ref="form">
                              <v-text-area>
                                <v-col cols="12" lg="12" sm="12" md="12">
                                  <Mentionable
                                    placement="bottom"
                                    :keys="['@']"
                                    :items="items"
                                    offset="6"
                                    limit="1000"
                                    insert-space
                                  >
                                    <textarea
                                      rows="6"
                                      placeholder="Write a comment, use @mention to notify a colleague..."
                                      class="input"
                                      v-model="commentHistory[firstIndex][index]"
                                      @keydown="handleInputKeyDown($event, index,firstIndex)"
                                    ></textarea>
                                  </Mentionable>

                                  <div class="btns">
                                    <v-btn
                                      class="cmnbtnstyle"
                                      id="btnshadow"
                                      color="#4fa5h6"
                                      @click="closeText(Data.task_history_id, index,firstIndex)"
                                    >
                                      Cancel
                                    </v-btn>
                                    &nbsp;
                                    <v-btn
                                      id="btnshadow"
                                      class="cmnbtnstyle"
                                      color="#4fa5d6"
                                      :disabled="
                                        commentHistory[firstIndex][index] == null ||
                                        commentHistory[firstIndex][index] == ''
                                      "
                                      @click="
                                        addComment(
                                          Data.task_id,
                                          index,
                                          Data.task_history_id,firstIndex
                                        )
                                      "
                                    >
                                      Save
                                    </v-btn>
                                  </div>
                                </v-col>
                              </v-text-area>
                            </v-form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <br/>

</div>

                  <div v-if="taskHistoryData.length == 0" style="margin-left: 40%">
                    <p>No data Available</p>
                  </div>
                  <div v-if="TaskHistoryLoaded.length != TotalTask">
                    <v-btn
                      class="btn"
                      @click="taskHistory()"
                      style="color: cornflowerblue; font-size: 14px; width: 100%"
                    >
                      <span class="mdi mdi-chevron-down iconLoad"></span>
                    </v-btn>
                  </div>
                </div>

              <div class="flex2">
                <h6>Status</h6>
                <div
                  class="card-shadow-danger mb-3 widget-chart widget-chart2 text-left card MainCardShadow"
                >
                  <div class="widget-content" style="word-break: break-all">
                    <div class="widget-content-outer">
                      <div class="widget-content-wrapper">
                        <div class="widget-content-left pr-2 fsize-1"></div>
                        <div class="widget-content-right w-100">
                          <div
                            class="progress-bar-xs progress"
                            style="word-wrap: break-word"
                          >
                            <div
                              class="progress-bar openStatus"
                              role="progressbar"
                              aria-valuenow="10"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              title="Open"
                              :style="{ width: this.openTask + '%' }"
                            ></div>

                            <div
                              class="progress-bar inprogressStatus"
                              role="progressbar"
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              title="Inprogress"
                              :style="{ width: this.inProgress + '%' }"
                            ></div>

                            <div
                              class="progress-bar resolvedStatus"
                              role="progressbar"
                              aria-valuenow="60"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              title="Resolved"
                              :style="{ width: this.resolved + '%' }"
                            ></div>

                            <div
                              class="progress-bar closedStatus"
                              role="progressbar"
                              aria-valuenow="10"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              title="Closed"
                              :style="{ width: this.closed + '%' }"
                            ></div>
                          </div>

                          <div class="progress-sub-label">
                            <div class="sub-label-right">Closed {{ this.closed }}%</div>
                            &nbsp;&nbsp;&nbsp;
                          </div>
                          <div class="text-center d-flex">
                            <div class="sub-label-right">
                              Open:
                              <router-link :to="'/task-list'">
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <div
                                      v-bind="attrs"
                                      v-on="on"
                                      class="badge openStatus mr-2"
                                      @click="StatusFilter(2)"
                                    >
                                      <div>
                                        {{ projectStatus.openTask }}
                                      </div>
                                    </div>
                                  </template>
                                  <span>Open </span>
                                </v-tooltip>
                              </router-link>
                            </div>
                            <br />

                            <div class="sub-label-right">
                              In Progress:

                              <router-link :to="'/task-list'">
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <div
                                      v-bind="attrs"
                                      v-on="on"
                                      class="badge inprogressStatus mr-2"
                                      @click="StatusFilter(3)"
                                    >
                                      <div>
                                        {{ projectStatus.inProgress }}
                                      </div>
                                    </div>
                                  </template>
                                  <span>Inprogress </span>
                                </v-tooltip>
                              </router-link>
                            </div>

                            <br />
                            <div class="sub-label-right">
                              Resolved:
                              <router-link :to="'/task-list'">
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <div
                                      v-bind="attrs"
                                      v-on="on"
                                      class="badge resolvedStatus mr-2"
                                      @click="StatusFilter(4)"
                                    >
                                      <div>
                                        {{ projectStatus.resolved }}
                                      </div>
                                    </div>
                                  </template>
                                  <span>Resolved </span>
                                </v-tooltip>
                              </router-link>
                            </div>
                            <br />
                            <div class="sub-label-right">
                              Closed:
                              <router-link :to="'/task-list'">
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <div
                                      v-bind="attrs"
                                      v-on="on"
                                      class="badge closedStatus mr-2"
                                      @click="StatusFilter(5)"
                                    >
                                      <div>
                                        {{ projectStatus.closed }}
                                      </div>
                                    </div>
                                  </template>
                                  <span>Closed </span>
                                </v-tooltip>
                              </router-link>
                            </div>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="card-shadow-danger mb-3 widget-chart widget-chart2 text-left card MainCardShadow"
                >
                  <div class="widget-content">
                    <div class="widget-content-outer">
                      <div class="widget-content-wrapper">
                        <div class="card-header-title" id="f1">Project</div>
                        <v-spacer></v-spacer>

                        <div v-if="this.projectRole == 3">
                          <editProject :projectData="projectStatus" />

                          <a
                            class="btn float-right"
                            v-on:click="ProjectDelete(ProjectData.project_id)"
                            title="Delete project"
                          >
                            <v-icon v-bind="attrs" v-on="on" style="color: red"
                              >mdi-delete</v-icon
                            >
                          </a>
                        </div>
                      </div>
                      <v-divider class="border-opacity-75"></v-divider>
                      <v-dialog class="modal" v-model="confirmation" max-width="500">
                        <v-card
                          ><br />

                          <v-card-text>
                            <h5>
                              <p>
                                Resources are allocated to this project.<br />
                                Are you sure to delete the Project?
                              </p>
                            </h5>
                          </v-card-text>

                          <v-card-actions
                            ><br /><br /><br /><br /><br />
                            <v-spacer></v-spacer>

                            <v-btn color="red" text @click="onClose()"> No </v-btn>

                            <v-btn color="green darken-1" text @click="dlt()">
                              Yes
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>

                      <div class="card cardMsg mb-3 widget-content projectClass">
                        <div class="widget-content-outer" style="word-break: break-all">
                          <div class="widget-content-wrapper">
                            <div class="widget-content-left">
                              <v-avatar>
                                <img
                                  src="https://innovature.ai/wp-content/uploads/2020/10/logo.png"
                                  alt="John"
                                />
                              </v-avatar>
                              <div class="widget-heading WordBreak projectNameHeading">
                                {{ projectStatus.project_name }}
                              </div>
                              <div class="widget-subheading WordBreak projectCodeHeading">
                                {{ projectStatus.project_code }}
                              </div>
                              <br />
                              <p style="word-wrap: brak-word" class="WordBreak">
                                {{ projectStatus.project_description }}
                              </p>
                              <br />
                              <div class="widget-subheading WordBreak">
                                Start Date: {{ projectStatus.start_date }}
                              </div>
                              <div class="widget-subheading WordBreak">
                                End Date: {{ projectStatus.end_date }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!------------------------------------------------------------------------------------------->
                <categoryProject :category="category" />

                <!------------------------------------------------------------------------------------------->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sideNavigation from "../AdminPage/Notification/sideBarr.vue";

import topNavigation from "./adminTopNav.vue";
import ApiService from "../../service/apiservice";
import editProject from "./EditProjectModal.vue";
import categoryProject from "./CategoryProject.vue";
import loader from "./Loader/loaderView.vue";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
let moment = require("moment");
import { Mentionable } from "vue-mention";

export default {
  components: {
    sideNavigation,
    topNavigation,
    editProject,
    loader,
    categoryProject,
    Mentionable,
  },
  data() {
    return {
      activity:[],
      limitData: "",
      commentResponse: [],
      projectId: "",
      text: "",

      moment: moment,
      filter: {
        filterArray: [2, 1],
      },
      filterArrays: ["1", "2"],
      data: {
        filterArray: [],
      },
      datavlues: [],
      viewFilter: [],
      loaderValue: false,
      searchText: null,
      searchProjects: null,
      pagination: 1,
      totalUsers: "",
      openStates: {},
      all: true,
      open: false,
      commentHistory: [[]],
      inprogress: false,
      resolved: false,
      closed: false,
      vShow: false,
      status: {
        resolved: Number,
        closed: Number,
        inProgress: Number,
        openTask: Number,
      },
      dialogCompose: false,
      footerHide:false,
      limit: 10,
      lengthTask: 5,
      TotalTask: "",
      CommentTaskId: "",
      isSubmit: false,
      confirmation: false,
      mentionlist: [],
      ProjectData: [],
      searchKey: "",
      searchResult: "",
      projectStatus: [],
      dialogm1: "",
      lastData: "",
      TaskHistoryLoaded: [],
      selectedMember: null,
      dialog: false,
      ProjectRoleList: [],
      taskHistoryData: [],
      none:null,
      projectRole: "",
      category_id: [],
      search: "",
      roleFilter: "",
      inputData: {
        comment: null,
        task_id: "",
        notify: [],
      },
      userId: {
        id: this.projectId,
      },
      dateFormatConfig: {
        dayOfWeekNames: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        dayOfWeekNamesShort: ["Su", "Mo", "Tu", "We", "Tr", "Fr", "Sa"],
        monthNames: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        monthNamesShort: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },

      keyData: {
        status: null,
        subtasking: null,
        keyWord: null,
      },
      Mention_list:[],
      user_list: { users: [], loading: false },
      headersNew: [
        {
          value: "profile_photo",
          sortable: false,
          class: "info",
          align: "end",
        },
        {
          value: "user_name",
          sortable: false,
          class: "info",
        },
        {
          value: "role",
          sortable: false,
          class: "info",
        },
        {
          value: "last_active",
          sortable: false,
          class: "info",
        },
      ],
    };
  },
  methods: {
    handleInputKeyDown(event, index,firstIndex) {
      if (event.key === "Backspace") {
        let comment = this.commentHistory[firstIndex][index];

        let lastWord = comment;
        if (
          lastWord.startsWith("@") &&
          lastWord.includes("@") &&
          lastWord.includes(".")
        ) {
          comment = " ";
        }

        this.commentHistory = comment;
      }
    },

    TaskRedirect(id, taskId) {
      localStorage.setItem("taskId", taskId);
      localStorage.setItem("projectId", id);
      this.$store.commit("getData", id);
      this.$store.commit("getTaskData", taskId);
    },

    setItNull() {
      this.searchProject = "";
      this.getAllocatedUser();
    },
    getStyle(last_active) {
      if (last_active != null) return "black--text font-weight-small";
      else return "-";
    },
    openText(id, index) {
      this.CommentTaskId = id;
      if (this.openStates[id]) {
        this.closeText(id, index);
      } else {
        this.$set(this.openStates, id, true);
      }
      // set the open state for the clicked card to true
    },
    closeText(id, index,firstIndex) {
      // set the open state for the clicked card to false
      this.$set(this.openStates, id, false);
      this.commentHistory[firstIndex][index] = "";
      this.inputData.comment = "";
      this.inputData.task_id = "";
      this.inputData.notify = [];
    },
    async StatusFilter(id) {
      localStorage.setItem("filter", id);
      if (id == 5) {
        this.all = true;
        this.open = false;
        this.inprogress = false;
        this.resolved = false;
        this.closed = false;
        this.params = {
          searchCol2: "project_id",
          searchKey2: this.projectId,
          sortMethod: "desc",
          sortCol: "task_id",
        };
        const response = await ApiService(
          "task/tasklist",
          "GET",
          null,
          null,
          this.params
        );
        this.task_list = { task: response?.data };
      } else {
        if (id == 1) {
          this.all = false;
          this.open = true;
          this.inprogress = false;
          this.resolved = false;
          this.closed = false;
        } else if (id == 2) {
          this.all = false;
          this.open = false;
          this.inprogress = true;
          this.resolved = false;
          this.closed = false;
        } else if (id == 3) {
          this.all = false;
          this.open = false;
          this.inprogress = false;
          this.resolved = true;
          this.closed = false;
        } else if (id == 4) {
          this.all = false;
          this.open = false;
          this.inprogress = false;
          this.resolved = false;
          this.closed = true;
        }
        this.params = {
          searchCol2: "project_id",
          searchKey2: this.projectId,
          searchCol: "task_status",
          searchKey: id,
          sortMethod: "desc",
          sortCol: "task_id",
        };
        this.getTask(this.params);
      }
    },
    async searchQuestion() {
      this.searchKey = this.searchText;
      console.log(this.searchKey,"searchkey")

      localStorage.setItem("search", this.searchKey);
  
      this.$router.push("/task-list");
    },

    async getAllocatedUser() {
  
      try {
        
        this.limitData = this.limit;
        if (this.limit == -1) {
          this.limitData = "";
        }
        const params = {
          searchKey: this.searchProject,

          page: this.pagination,
          limit: this.limitData,
        };
        const id = this.projectId;
        const data = {};
        const response = await ApiService(
          "project/Usersprojects/" + id,
          "POST",
          data,
          null,
          params
        );
  

        this.user_list = response.listView;
        if(this.user_list.length==0){
          this.footerHide=true;
        }
        else{
          this.footerHide=false;

        }

        this.totalUsers = response.total;
      } catch (error) {
        console.log(error, "error................");
      }
    },
    async getMention() {
  
  try {
    
   
    const id = this.projectId;
    const data = {};
    const response = await ApiService(
      "project/Usersprojects/" + id,
      "POST",
      data,
      null,
     
    );


    this.Mention_list = response.listView;
  

    this.totalUsers = response.total;
  } catch (error) {
    console.log(error, "error................");
  }
},
  
    async taskHistory() {
  const id = this.projectId;
  const params = {
    last_data: this.lastData,
    limit: 10,
  };
  this.filter.filterArray = this.filterArrays;
  const responseData = await ApiService(
    "/task/getTaskHistory/" + id,
    "POST",
    this.filter,
    null,
    params
  );

  if (this.lastData == "") {
    this.TotalTask = responseData.total;
  }

  if (typeof responseData == "object") {
    this.taskHistoryData = responseData.resultArray;

    for (const element of this.taskHistoryData) {
      let activityIndex = this.activity.findIndex(x => x.date == element.group_date);
      if (activityIndex >= 0) {
        this.activity[activityIndex].data.push(element);
      } else {
        this.activity.push({
          date: element.group_date,
          data: [element]
        });
      }
    }

    this.commentHistory = this.activity.map(() => []);
    this.TaskHistoryLoaded.push(...this.taskHistoryData);
    this.lastData = this.taskHistoryData[9].update_type == 1 ? this.taskHistoryData[9].task_history_id : this.taskHistoryData[9].project_history_id;
    this.length = this.taskHistoryData.length;
  } else {
    this.$router.push("/dashboard");
  }
},
    async ProjectStatus() {
      const id = this.projectId;
      this.loaderValue = false;
      const response = await ApiService("/project/overallProjectStatus/" + id, "GET");
      this.loaderValue = true;

      if (response.statusCode == 50) {
        this.$router.push("/dashboard");
      }
      if (response.statusCode == 399) {
        this.$router.push("/dashboard");
      }
      this.projectStatus = response;
      this.category = response.categoryPercentage;

      this.inProgress =
        (this.projectStatus.inProgress * 100) / this.projectStatus.total_task;
      this.closed = Math.floor(
        this.projectStatus.total_task
          ? (this.projectStatus.closed * 100) / this.projectStatus.total_task
          : 0
      );
      this.openTask = (this.projectStatus.openTask * 100) / this.projectStatus.total_task;
      this.resolved = (this.projectStatus.resolved * 100) / this.projectStatus.total_task;
      this.projectRole = localStorage.getItem("projectRole");
    },
    async addComment(task_id, index, ids,firstIndex) {
      try {
        this.inputData.task_id = task_id;
        this.inputData.comment = this.commentHistory[firstIndex][index];
        const id = this.projectId;
        const responseTask = await ApiService(
          "/task/commentTask/" + id,
          "POST",
          this.inputData
        );
        this.commentResponse = responseTask;
        this.lastData = "";
        this.TaskHistoryLoaded = [];

        this.taskHistory();
        Vue.$toast.success("Comment added successfully...", {
          position: "top",
        });

        this.$set(this.openStates, ids, false);
        setTimeout(() => window.location.reload(), 500);
      } catch (error) {
        Vue.$toast.warning("Failed to add comment", {
          position: "top",
        });
      }
    },

    async dlt() {
      this.confirmation = false;

      try {
        const id = this.projectId;
        const URL = "/project/project/" + id;
        const response = await ApiService(URL, "DELETE");
        if (response.statusCode == 200) {
          Vue.$toast.success("Project Deleted Successfully", {
            position: "top",
            queue: true,
          });
          this.$router.push("/dashboard");
        }
      } catch (error) {
        const response = error.response.data;
        if (response.statusCode == 50) {
          Vue.$toast.error("Project not found", {
            position: "top",
            queue: true,
          });
        }
      }
    },

    async GetProjectRole() {
      const response = await ApiService("/project/projectRole/" + this.projectId, "GET");
      if (response.statusCode == 399) {
        this.$router.go("/dashboard");
      }
      this.ProjectRoleList = response;
      localStorage.setItem("projectRole", JSON.stringify(response.project_role));
    },

    ProjectDelete(id) {
      this.confirmation = true;
      this.project_id = id;
    },
    closeDialog() {
      this.dialogCompose = false;
    },
    onClose() {
      this.confirmation = false;
      this.project_id = null;
    },
    async optionUpdated() {
      this.dialog = false;

      for (const filter of this.filterArrays) {
        this.data.filterArray.push(parseInt(filter));
      }
      this.activity=[];
      this.TaskHistoryLoaded = [];
      this.lastData = "";
      this.taskHistory();
      this.data.filterArray = [];
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

    convertToBlue(text) {
      let words = text.split(" ");
      let result = "";
      for (let word of words) {
        if (word.includes("@") && word.includes(".")) {
          // Check if word looks like an email
          result += "<span style='color: #4fa5d6 '>" + word + "</span> ";
        } else if (word.startsWith("@")) {
          // Check if word starts with "@"
          result += "<span >" + word + "</span> ";
        } else {
          result += word + " ";
        }
      }
      return result.trim();
    },
  },
  watch: {
    // whenever  the given depenedancy  changes, this function will run

    searchKey: function () {
      this.searchUser();
    },
    limit: {
      handler() {
        this.getAllocatedUser();
      },
      immediate: false,
    },

    pagination: {
      handler() {
        this.getAllocatedUser();
      },
      immediate: false,
    },
  },

  mounted() {
    localStorage.removeItem("search")
    this.projectRole = localStorage.getItem("projectRole");

    this.projectId = this.$store.state.projectId;
    if (this.projectId === "null") {
      this.$router.push("/dashboard");
    }
    localStorage.setItem("projectId", this.projectId);

    this.ToggleOnOff(localStorage.getItem("is_expanded") === "true");

    this.ProjectStatus();
    this.taskHistory();
    this.getMention()
    this.getAllocatedUser();
    this.GetProjectRole();
    // this.searchUser();
  },
  computed: {
    assigne() {
      let datavlues = [];
      this.user_list?.map((data) => {
        datavlues.push({
          value: data?.user?.user_id,
          text: data?.user?.user_name,
        });
      });

      return datavlues;
    },
    items() {
      let mentionlist = [];
      this.Mention_list?.map((data) => {
        let emails = data?.user?.email;

        mentionlist.push({
        
          label: emails,
          value: emails,
        });
      });
      

      return mentionlist;
    },


  },
};
</script>

<style scoped>
#f1 {
  font-size: larger;
  font-weight: bold;
}
#f2 {
  font-size: medium;
  font-weight: 500;
}
#frame {
  box-sizing: border-box;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-color: aliceblue;
  width: 70%;
  height: fit-content;
}
#filter {
  margin-left: 750px;
  margin-top: -31px;
}
#btn {
  margin-left: 2%;
}
#pfil {
  margin-left: 3%;
}
#margin {
  flex-direction: column;
  width: 100%;
}
.modal {
  height: 50%;
}
.WordBreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.searchBar {
  width: 55%;

  align-items: center;
  height: 1.9rem;

  margin-left: 54%;
}

.list {
  height: 12%;
}
.mdi-message-processing::before {
  margin-left: 87%;
  margin-bottom: -9%;
}
.srch {
  margin-left: 36%;
  margin-bottom: 0%;
  width: 30%;
}
.search {
  margin-left: 30%;
  margin-right: 0%;
  margin-bottom: 0%;
  width: 70%;
}

.msg-icon {
  text-align: right;
  margin-right: 6%;
}
#TextBox {
  display: none;
}
.Toptitle {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
  background-color: #fff !important;
}

#pageTitle {
  height: 50px;
  width: 90%;
}
#avtar {
  margin-right: 4%;
  margin-top: 4%;
}
#icons {
  margin-left: 3%;
}
#searching {
  margin-left: 2%;
  width: 34%;
}
@media only screen and (max-width: 1450px) {
  #searching {
    margin-left: 2%;
    width: 34%;
  }
}
.align_row {
  margin-left: 0.5%;
  margin-top: 1%;
}
#rows {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 1%;
  width:65%;
 
}
.btns {
  margin-left: 35%;
}
.Taskname {
  word-break: break-all;
  text-decoration: none;
}
.commentBox {
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.text {
  word-break: break-word;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 600px;
}
h6 {
  margin-top: -9%;
  font-weight: bold;
}
.logo {
  width: 40px;
}
@media only screen and (max-width: 1450px) {
  .search {
    padding-left: 12px;
    margin-right: 0%;
    margin-bottom: 0%;
  }
  .Taskname {
    word-break: break-word !important;
    text-decoration: none;
  }
  .logo {
    width: 40px;
  }
  .searchBoxAll {
    padding-left: 30px;
  }
  .names {
    font-size: 14px;
    white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      margin-top: -7px;
  }
}

.fixed-sidebar .app-main .app-main__outer {
  z-index: 9;
  margin-left: 220px;
  padding-left: 0px;
}
.recentCard {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.projectClass {
  box-shadow: none;
}
.MainCardShadow {
  margin-top: 5%;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.openStatus {
  background-color: #ed8077;
  color: white;
}
.inprogressStatus {
  background-color: #4488c5;
  color: white;
}
.resolvedStatus {
  background-color: #5eb5a6;
  color: white;
}

.closedStatus {
  background-color: #a1af2f;
  color: white;
}

#app .atwho-ul {
  min-width: 300px !important;
}
#app.atwho-view {
  /* max-width: 371px !important; */
  max-width: 412px !important;
}
.chipset2 {
  width: 175px;
  min-height: 46px;
  justify-content: center;
}
.v-text {
  color: #4488c5;
}

.input {
  padding: 3px;
  width: 100%;
  margin-bottom: 1%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  max-height: 200px;
  min-height: 100px;
  border: 1px solid black;
}

.mention-item {
  padding: 4px 10px;
  border-radius: 4px;
}

.mention-selected {
  background: #4fa5d6 !important;
  color: #4488c5 !important;
}
input.mention-selected {
  color: #4488c5 !important;
}
.newClass {
  margin-left: 40px;
}
.headingContent {
  margin-left: 40px;
  margin-top: -27px;
}
.ImageProfile {
  margin-top: 17px;
  margin-left: -5px;
}

.newDiv {
  width: 4%;
}
.projectNameHeading {
  margin-left: 50px;
  margin-top: -45px;
}
.projectCodeHeading {
  margin-left: 50px;
}
.alignbtn {
  justify-content: center;
}
.iconLoad {
  font-size: 30px;
}
.app-page-title .page-title-heading {
    font-size: 1.25rem;
    font-weight: 400;
    display: flex;
    align-content: center;
    align-items: center;
    width: 57% !important;
}

.v-label {
  top: 10px !important ;
}
#BlockSearch {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: end;
}
#memberlist{
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
#forFlex1{
  gap: 20px;
}
.flex1{
  flex:2;
}
.flex2{
  flex: 1;

}
@media screen and (max-width:600px){
  .SidebarHome{
  display: none!important;
}
h6 {
  margin-top: 0%;
  font-weight: bold;
}


.app-page-title .page-title-heading {
    font-size: 1.25rem;
    font-weight: 400;
    display: flex;
    align-content: center;
    align-items: center;
    width: 106% !important;
}
}
  @media screen and (max-width:912px){
    #forFlex1{
      flex-direction: column;
      margin-top: 40px;
    }
    h6 {
  margin-top: 0%;
  font-weight: bold;
}
    #rows{
      margin-top: 138px;
      margin-left: 136px;
    }
    #BlockSearch{
      flex-direction: column;
      margin-top: 60px;
    }
    #searching{
      width: 100%!important;
      margin-left: 0!important;
    }
    .searchBoxAll{
      padding-left: 0!important;
    }
    .search{
      padding-left: 0!important;
    }
    #icons {
    margin-left: 86%;
    top: -31px;
}
.app-page-title .page-title-heading {
    font-size: 1.25rem;
    font-weight: 400;
    display: flex;
    align-content: center;
    align-items: center;
    width: 100% !important;
}
.srch {
    margin-left: 0%;
    margin-bottom: 0%;
    width: 54%;
}
.names{
  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: -29px;
}
.btns {
    margin-left: 18%;
}

  }
  .names{
  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2%;
}
</style>
