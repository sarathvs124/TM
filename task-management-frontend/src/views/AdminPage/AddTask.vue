<template>
  <div
    class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header"
  >
    <topNavigation />

    <div class="app-main">
      <sideNavigation @SideBarToggle="ToggleOnOff" />

      <div class="app-main__outer" id="boxs" v-bind:style="{'margin-left': '64px', 'transition': none}">
        <div class="app-main__inner">
          <div v-if="!loaderValue">
            <loader />
          </div>
          <div v-if="loaderValue">
            <div class="app-page-title bg-light p-1 Toptitle">
              <div class="page-title-wrapper" id="pageTitle">
                <div class="page-title-heading">
                  <router-link exact :to="'/home'">
                    <v-img
                      class="logo"
                      src="../../assets/Images/logo.png"
                      width="40"
                    ></v-img>
                  </router-link>
                  <div
                    class="names"
                    :title="`${projectStatus.project_name} (${projectStatus.project_code})`"
                  >
                    {{ projectStatus.project_name }} ({{
                      projectStatus.project_code
                    }})
                  </div>
                </div>
                <div id="searchTask">
                  <v-form
                    id="searching"
                    ref="form"
                    action=""
                    @submit.prevent="searchTask()"
                  >
                    <v-text-field
                      v-model="normalSearch.keyWord"
                      label="Search Task"
                      outlined
                      rounded
                      background-color="white"
                      clearable
                      @keyup.enter="searchTask()"
                      prepend-inner-icon="mdi-magnify"
                      dense
                    ></v-text-field>
                  </v-form>
                </div>
              </div>
            </div>
            <div v-if="value == true" class="previewDiv">
              <v-col cols="6" sm="4">
                <template v-if="data.issue_type == 1">
                  <v-btn
                    outlined
                    rounded
                    color="white"
                    width="100px"
                    height="30px"
                    style="
                      border: none;
                      font-size: 12px;
                      text-transform: none;
                      background-color: #e64754;
                    "
                  >
                    {{ findIssuetype(data.issue_type) }}
                  </v-btn>
                </template>
                <template v-if="data.issue_type == 2">
                  <v-btn
                    outlined
                    rounded
                    color="white"
                    width="100px"
                    height="30px"
                    style="
                      border: none;
                      font-size: 12px;
                      text-transform: none;
                      background-color: #478af5;
                    "
                  >
                    {{ findIssuetype(data.issue_type) }}
                  </v-btn>
                </template>
                <template v-if="data.issue_type == 3">
                  <v-btn
                    outlined
                    rounded
                    color="white"
                    width="100px"
                    height="30px"
                    style="
                      border: none;
                      font-size: 12px;
                      text-transform: none;
                      background-color: #21c241;
                    "
                  >
                    {{ findIssuetype(data.issue_type) }}
                  </v-btn>
                </template>
                <template v-if="data.issue_type == 4">
                  <v-btn
                    :title="taskData.issue_name"
                    outlined
                    rounded
                    color="white"
                    width="100px"
                    height="30px"
                    style="
                      border: none;
                      font-size: 12px;
                      text-transform: none;
                      background-color: #d9991a;
                    "
                  >
                    {{ findIssuetype(data.issue_type) }}
                  </v-btn>
                </template>

                <template
                  v-if="
                    data.issue_type != 1 &&
                    data.issue_type != 2 &&
                    data.issue_type != 3 &&
                    data.issue_type != 4 &&
                    data.issue_type
                  "
                >
                  <label
                    class="text-truncate"
                    outlined
                    rounded
                    color="white"
                    width="100px"
                    height="30px"
                    style="
                      border: none;
                      font-size: 12px;
                      text-transform: none;
                      background-color: plum;
                    "
                  >
                    {{ findIssuetype(data.issue_type) }}
                  </label>
                </template>
              </v-col>

              <v-col cols="6" sm="4">
                {{ data.task_name }}
              </v-col>
              <div class="taskcontent">
                <!-----------------description---------------------------------------->

                <div>
                  <div>
                    <div class="discription" v-html="ff"></div>
                    <!------------------------------------------------------------------>

                    <div class="tdata">
                      <div
                        class="des"
                        v-html="data.task_description"
                        id="descVhtml"
                      ></div>
                      <br />
                      <template>
                        <v-row>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft1">
                                <v-row>
                                  <v-col cols="6" sm="4" xs="8">
                                    <span>Parent Issue : </span>
                                  </v-col>

                                  <v-col cols="6" sm="4" xs="8">
                                    {{ parent.parent_task }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>

                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4" xs="8">
                                    <span>Category type : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4" xs="8">
                                    {{ findcategorytype(data.category) }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                        </v-row>
                      </template>
                      <template>
                        <v-row> </v-row>
                      </template>
                      <template>
                        <v-row>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4" xs="8">
                                    <span>Priority : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4" xs="8">
                                    {{ findPrioritytype(data.priority) }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4" xs="8">
                                    <span>Actual hour : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4" xs="8">
                                    {{ data.actual_hours }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                        </v-row>
                      </template>
                      <template>
                        <v-row>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridright">
                                <v-row>
                                  <v-col cols="6" sm="4" xs="8">
                                    <span>Assignee : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4" xs="8">
                                    {{ getAssignee(data.assignee) }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>

                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4" xs="8">
                                    <span>Start Date : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4" xs="8">
                                    {{ data.start_date }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                        </v-row>
                      </template>
                      <template>
                        <v-row>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4" xs="8">
                                    <span>End Date : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4" xs="8">
                                    {{ data.end_date }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>

                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4" xs="8">
                                    <span>Estimated hour : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4" xs="8">
                                    {{ data.estimated_hours }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                        </v-row>
                      </template>

                      <div class="gridleft">
                        <v-row>
                          <v-col cols="6" sm="4" xs="8">
                            <span>Files : </span>
                          </v-col>
                          <v-col cols="6" sm="4" xs="8" class="fileName">
                            {{ files.name }}
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </div>
                  <br /><br />
                </div>
              </div>
              <br />
              <br />
              <template>
                <v-row class="align_item previewBtn">
                  <v-btn
                    class="cmnbtnstyle"
                    v-on:click="value = false"
                    color="#4fa5h6"
                    id="btnshadow1"
                    >Cancel</v-btn
                  >
                  <v-btn
                    class="cmnbtnstyle"
                    color="#4fa5d6"
                    :disabled="!addForm"
                    v-on:click="add1()"
                    id="btnshadow1"
                    >Save</v-btn
                  >
                </v-row>
              </template>
            </div>

            <v-form
              ref="form"
              @submit.prevent="add"
              method="post"
              v-if="value == false"
              v-model="isValid"
              id="addtaskform"
            >
              <div class="parentissue">
                <v-btn
                  class="cmnbtnstyle1"
                  rounded
                  color="#4fa5d6"
                  id="btnshadow"
                  @click="parentIssue = !parentIssue"
                  title="Add Parent Issue"
                  >Add Parent Issue</v-btn
                >
                <div v-if="parentIssue">
                  <div class="parentIssuediv">
                    <v-row class="d-flex subdiv">
                      <span class="issuelabel" for="name">Parent Issue : </span>

                      <v-text-field
                        v-if="parent.parent_task != null"
                        background-color="white"
                        v-model="parent.parent_task"
                        outlined
                        clearable
                        :readonly="isReadonly"
                        @click:clear="clearParent()"
                        class="AddparenttextDiv"
                        dense
                      ></v-text-field>

                      <v-btn
                        small
                        class="cmnbtnstyle"
                        id="issuelabel1"
                        @click="
                          dialog = true;
                          tasksearch();
                        "
                        color="#4fa5d6"
                        title="Browse"
                        >Browse</v-btn
                      >
                    </v-row>
                  </div>
                </div>
              </div>
              <div class="addTask">
                <v-col class="d-flex" cols="12" sm="6" md="4" lg="3">
                  <v-autocomplete
                    dense
                    background-color="white"
                    :items="issuedata"
                    v-model="data.issue_type"
                    label="Issue Type"
                    :rules="IssueRule"
                    :error-messages="issueError || ''"
                    outlined
                    v-on:change="keyCheck()"
                  ></v-autocomplete>
                </v-col>

                <v-col class="d-flex" cols="12" sm="12">
                  <v-text-field
                    dense
                    background-color="white"
                    v-model="data.task_name"
                    label="Subject"
                    :rules="subjectRules"
                    @input="taskError"
                    :error-messages="subjectError"
                    v-on:keyup="checking()"
                    outlined
                  ></v-text-field>
                  <span class="errortask">{{ this.taskerror }}</span>
                </v-col>
                <v-card elevation="5" class="cardss"
                  ><br />
                  <v-col cols="12" lg="12" md="12" sm="12">
                    <ckeditor
                      :editor="editor"
                      v-model="data.task_description"
                      scrollable
                      @input="checking()"
                      :config="editorConfig"
                      ref="editorCk"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-row>
                      <v-col
                        class="d-flex"
                        cols="12"
                        sm="3"
                        md="6"
                        lg="3"
                        xl="3"
                        xs="3"
                      >
                        <label for="label" class="labels">Status</label>
                      </v-col>
                      <v-col
                        class="d-flex"
                        cols="12"
                        sm="12"
                        xs="9"
                        lg="3"
                        md="6"
                        xl="3"
                      >
                        <v-text-field
                          dense
                          background-color="white"
                          value="Open"
                          label="Satus"
                          disabled
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="3"
                        md="6"
                        lg="3"
                        xl="3"
                        xs="3"
                      >
                        <label for="label" class="labels">Category</label>
                      </v-col>
                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="9"
                        xs="9"
                        lg="3"
                        md="6"
                        xl="3"
                      >
                        <v-autocomplete
                          dense
                          auto-select-first
                          background-color="white"
                          :items="categorydata"
                          v-model="data.category"
                          label="Category"
                          :rules="categoryRules"
                          :error-messages="categoryError || ''"
                          outlined
                          v-on:change="keyCheck()"
                        ></v-autocomplete>
                      </v-col>

                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="3"
                        md="6"
                        lg="3"
                        xl="3"
                        xs="3"
                      >
                        <label for="label" class="labels">Priority</label>
                      </v-col>
                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="9"
                        xs="9"
                        lg="3"
                        md="6"
                        xl="3"
                      >
                        <v-autocomplete
                          dense
                          auto-select-first
                          max-height="3%"
                          v-model="data.priority"
                          :items="priority"
                          :rules="priorityRules"
                          label="Priority"
                          outlined
                          v-on:change="keyCheck()"
                        ></v-autocomplete>
                      </v-col>

                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="3"
                        md="6"
                        lg="3"
                        xl="3"
                        xs="3"
                      >
                        <label for="label" class="labels">Assignee</label>
                      </v-col>
                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="9"
                        xs="9"
                        lg="3"
                        md="6"
                        xl="3"
                      >
                        <v-autocomplete
                          dense
                          auto-select-first
                          max-height="3%"
                          v-model="data.assignee"
                          :items="assigne"
                          label="Assignee"
                          outlined
                          v-on:change="keyCheck()"
                        ></v-autocomplete>
                      </v-col>

                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="3"
                        md="6"
                        lg="3"
                        xl="3"
                        xs="6"
                      >
                        <label for="label" class="labels">Start Date</label>
                      </v-col>
                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="9"
                        xs="12"
                        lg="3"
                        md="6"
                        xl="3"
                      >
                        <v-menu
                          v-model="menu"
                          min-width="auto"
                          :close-on-content-click="false"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              dense
                              v-model="data.start_date"
                              placeholder="Start Date"
                              prepend-inner-icon="mdi-calendar-blank"
                              readonly
                              outlined
                              :rules="startdateRules"
                              v-bind="attrs"
                              v-on="on"
                              clearable
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="data.start_date"
                            :min="minDate"
                            :max="maxDate"
                            @input="menu = false"
                            v-on:change="keyCheck()"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                   
                        <v-col
                          class="d-flex"
                          cols="6"
                          sm="3"
                          md="6"
                          lg="3"
                          xl="3"
                          xs="3"
                        >
                          <label for="label" class="labels">End Date</label>
                        </v-col>
                       
                        <v-col
                          class="d-flex"
                          cols="6"
                          sm="9"
                          xs="9"
                          lg="3"
                          md="6"
                          xl="3"
                        >
                       
                          <v-menu
                            min-width="auto"
                            v-model="menu1"
                            :close-on-content-click="false"
                            id="endDateMenu"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                dense
                                v-model="data.end_date"
                                placeholder="End Date"
                                icon="mdi-calendar"
                                readonly
                                prepend-inner-icon="mdi-calendar-blank"
                                outlined
                                :rules="enddateRules"
                                v-bind="attrs"
                                v-on="on"
                                clearable
                              ></v-text-field>
                            </template>
                           
                            <v-date-picker
                         
                              v-model="data.end_date"
                              :min="data.start_date"
                              :max="maxDate"
                              @input="menu1 = false"
                              v-on:change="keyCheck()"
                            ></v-date-picker>
                          </v-menu>
                       
                       
                        </v-col>
                      
                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="4"
                        md="6"
                        lg="3"
                        xl="3"
                        xs="4"
                      >
                        <label for="label" class="labels"
                          >Estimated Hours</label
                        >
                      </v-col>
                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="8"
                        xs="8"
                        lg="3"
                        md="6"
                        xl="3"
                      >
                        <v-text-field
                          dense
                          type="polyfill"
                          min="0"
                          max="72"
                          v-model="data.estimated_hours"
                          :rules="hoursRules"
                          max-height="3%"
                          label="Estimated Hours"
                          outlined
                          @input="checking()"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="4"
                        md="6"
                        lg="3"
                        xl="3"
                        xs="4"
                      >
                        <label for="label" class="labels">Actual Hours</label>
                      </v-col>
                      <v-col
                        class="d-flex"
                        cols="6"
                        sm="8"
                        xs="8"
                        lg="3"
                        md="6"
                        xl="3"
                      >
                        <v-text-field
                          class="fields"
                          dense
                          type="polyfill"
                          min="0"
                          max="72"
                          v-model="data.actual_hours"
                          :rules="hoursRules"
                          max-height="3%"
                          label="Actual Hours"
                          outlined
                          @input="checking()"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-card-actions>
                    <v-card-subtitle> </v-card-subtitle>
                  </v-card-actions>
                </v-card>
                <v-col cols="12" lg="12" md="12" sm="12">
                  <v-file-input
                    dense
                    class="fileAlign"
                    v-model="files"
                    @input="checking()"
                    label="File Input"
                    placeholder="Select your files"
                    outlined
                    :show-size="1000"
                    accept="image/png,image/jpeg,image/jpg, application/pdf,video/mp4,text/csv"
                    v-on:change="
                      handleFileUploads($event);
                      keyCheck();
                    "
                  >
                    <template v-slot:selection="{ index, text }">
                      <v-chip v-if="index < 2" color="blue " dark label small>
                        {{ text }}
                      </v-chip>
                    </template>
                  </v-file-input>
                  <p class="danger" v-if="error">{{ error }}</p>
                </v-col>

                <v-col cols="12" lg="12" md="12" sm="12">
                  <label for="label" class="labels">Notify:</label>
                  <v-autocomplete
                    dense
                    multiple
                    outlined
                    clearable
                    deletable-chips
                    chips
                    small-chips
                    :items="Users"
                    v-model="data.notify"
                    item-text="text"
                    item-value="value"
                    label="Search Users"
                    style="width: 100%"
                  >
                  </v-autocomplete>
                </v-col>
                <v-row align="center" class="align-text TaskBtn">
                  <div v-if="num == 0">
                    <v-btn
                      class="cmnbtnstyle"
                      v-on:click="value = true"
                      color="#4fa5h6"
                      :disabled="!isValid"
                      @click="previeClick()"
                      >Preview</v-btn
                    >
                  </div>
                  <div v-if="num == 1">
                    <v-btn
                      class="cmnbtnstyle"
                      v-on:click="value = true"
                      color="#4fa5h6"
                      disabled
                      @click="previeClick()"
                      >Preview</v-btn
                    >
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div v-if="num == 0">
                    <v-btn
                      color="#4fa5d6"
                      class="cmnbtnstyle"
                      v-on:click="add()"
                      :disabled="!isValid"
                      id="btnshadow"
                      >Save</v-btn
                    >
                  </div>
                  <div v-if="num == 1">
                    <v-btn
                      color="#4fa5d6"
                      v-on:click="add()"
                      disabled
                      id="btnshadow"
                      >Save</v-btn
                    >
                  </div>
                </v-row>
                <!---------------------------------Browse modal--------------------------------------------------->
                <template>
                  <v-dialog v-model="dialog" persistent max-width="700px">
                    <v-card>
                      <div id="title">
                        <v-card-title>
                          <span>Add existing issue</span>
                          <v-spacer></v-spacer>

                          <v-btn icon @click="closeDialog" dark color="black">
                            <v-icon> mdi-close </v-icon>
                          </v-btn>
                        </v-card-title>
                      </div>
                      <br />
                      <v-card-text>
                        <div style="display: flex">
                          <v-col
                            class="d-flex searchBar browseSearch"
                            height="3%"
                            cols="12"
                            lg="6"
                            md="6"
                            sm="12"
                            xs="12"
                          >
                            <v-form
                              ref="form1"
                              action=""
                              @submit.prevent="tasksearch()"
                              @keyup:clear="setItNull()"
                            >
                              <v-text-field
                                v-model="issueSearrch.keyword"
                                label="Search Task"
                                outlined
                                v-on:keyup="tasksearch()"
                                @click:clear="clearSearch()"
                                rounded
                                clearable
                                prepend-inner-icon="mdi-magnify"
                                dense
                              ></v-text-field>
                            </v-form>
                          </v-col>
                        </div>
                        <v-container>
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
                              :headers="headers"
                              :items="task_list.task"
                              class="elevation-1"
                              @click:row="handleClick"
                            >
                              <template v-slot:[`item.task_name`]="{ item }">
                                <div>{{ truncate(item.task_name, 10) }}</div>
                              </template>
                              <template v-slot:[`item.task_status`]="{ item }">
                                <td v-if="item.task_status == 1">
                                  <v-btn
                                    outlined
                                    rounded
                                    title="Open"
                                    color="white"
                                    width="120px"
                                    height="30px"
                                    style="
                                      border: none;
                                      font-size: 12px;
                                      text-transform: none;
                                      background-color: #ed8077;
                                    "
                                  >
                                    Open
                                  </v-btn>
                                </td>
                                <td v-if="item.task_status == 2">
                                  <v-btn
                                    outlined
                                    rounded
                                    title="Inprogress"
                                    color="white"
                                    width="120px"
                                    height="30px"
                                    style="
                                      border: none;
                                      font-size: 12px;
                                      text-transform: none;
                                      background-color: #4488c5;
                                    "
                                  >
                                    Inprogress
                                  </v-btn>
                                </td>
                                <td v-if="item.task_status == 3">
                                  <v-btn
                                    outlined
                                    rounded
                                    title="Resolved"
                                    color="white"
                                    width="120px"
                                    height="30px"
                                    style="
                                      border: none;
                                      font-size: 12px;
                                      text-transform: none;
                                      background-color: #5eb5a6;
                                    "
                                  >
                                    Resolved
                                  </v-btn>
                                </td>
                                <td v-if="item.task_status == 4">
                                  <v-btn
                                    outlined
                                    rounded
                                    color="white"
                                    width="120px"
                                    height="30px"
                                    title="Closed"
                                    style="
                                      border: none;
                                      font-size: 12px;
                                      text-transform: none;
                                      background-color: #a1af2f;
                                    "
                                  >
                                    Closed
                                  </v-btn>
                                </td>
                              </template>
                            </v-data-table>
                          </div>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </template>
              </div>
            </v-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!--------------------------------------------functions--------------------------------------------------->

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import ApiService from "../../service/apiservice";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import loader from "./Loader/loaderView.vue";
import sideNavigation from "../AdminPage/Notification/sideBarr.vue";

import topNavigation from "./adminTopNav.vue";
import http from "../../http-common";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";

export default {
  components: {
    sideNavigation,
    topNavigation,
    loader,
  },
  datas: () => ({
    ProjectData: [],

    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    menu1: false,
    menu3: false,
    modal: false,
    menu2: false,
  }),
  validations: {
    data: {
      task_description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(255),
      },
      $autodirty: true,
    },
  },
  data() {
    return {
      loaderValue: false,
      addValue: false,
      addForm: false,
      isValid: true,
      valid: true,
      num: 0,
      value: false,
      parentIssue: false,
      addtaskData: null,
      addtaskfile: null,
      taskerror: "",
      error: null,
      user_list: [],
      itemsDate: [],
      formSubmitted: false,
      projectStatus: [],
      editor: ClassicEditor,
      editorConfig: {
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "bulletedList",
          "numberedList",
          "|",

          "undo",
          "redo",
        ],
      },

      menu3: false,
      menu2: false,
      menu: false,
      menu1: false,
      file: [],
      files: [],
      fileSubmit: false,
      dialog: false,
      issuedata: [],
      categorydata: [],
      serarchkey: {
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

      data: {
        project_id: null,
        end_date: null,
        start_date: null,
        assignee: null,
        estimated_hours: null,
        actual_hours: null,
        task_name: null,
        task_description: null,
        category: null,
        issue_type: null,
        parent_id: null,
        notify: [],
      },

      parent: {
        parent_task_id: null,
        parent_task: null,
      },
      issueSearrch: {
        relation: [1, 2],
        task_status: [1, 2, 3],

        priority: [],

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
      normalSearch: {
        status: "",
        subtasking: "",
        keyWord: "",
      },

      headers: [
        {
          text: "Key",
          sortable: false,
          value: "task_id",
          align: "start",
        },
        { text: "Subject", value: "task_name", sortable: false },
        { text: "Status", value: "task_status", sortable: false },
      ],
      task_list: { task: [] },
      parenttask: { task: [] },

      priority: [
        { value: 3, text: "High" },
        { value: 2, text: "Normal" },
        { value: 1, text: "Low" },
      ],

      typeRules: [(v) => !!v || "Task Type is required"],

      hoursRules: [
        (v) => !/^[0-9e]{10,12}$/.test(v) || "Allow digits only",
        (v) => !v || /^[0-9]{0,2}(\.[0-9]{0,2})?$/.test(v) || "Invalid hour",
        (v) =>
          !v ||
          (0 < v && v <= 72) ||
          "hours should greater than 0 and equal 72",
      ],
      subjectRules: [
        (v) => !!v || "Subject is required",
        (v) => !/^\s/.test(v) || "Invalid subject",
        (v) => (v && v.length >= 3) || "Subject must greater than or equal 3",
        (v) => (v && v.length <= 255) || "Subject should between 3 to 255",
        (v) =>
          /^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! )$/.test(v) ||
          "Subject should between 3 to 255",
      ],
      IssueRule: [(v) => !!v || "Issue Type is required"],
      priorityRules: [(v) => !!v || "Priority  is required"],
    };
  },
  methods: {
    clearParent() {
      this.parent.parent_task_id = null;
    },
    taskError() {
      console.log(this.data.task_name, "task name");
    },
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
    previeClick() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    getAssignee(id) {
      if (id == null) {
        return null;
      } else {
        let categorySelected = this.user_list.filter((item) => {
          if (item.user_id == id) {
            return item;
          }
        });
        return categorySelected[0].user_name;
      }
    },
    async tasksearch() {
      try {
        const id = this.projectId;
        const response = await ApiService(
          "/task/advancedsearch/" + id,
          "POST",
          this.issueSearrch
        );

        this.task_list = { task: response?.data }
      } 
      catch (error) {
          console.log(error);
      }
    },
    async clearSearch() {
      const data = {
        relation: [1, 2],
        task_status: [1, 2, 3],
        priority: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        start_date_from_date: "",
        start_date_to_date: "",
        due_date_from_date: "",
        due_date_to_date: "",
        keyword: null,
      };

      try {
        const id = this.projectId;
        const response = await ApiService(
          "/task/advancedsearch/" + id,
          "POST",
          data
        );

        this.task_list = { task: response?.data };
      } catch (error) {
        console.log(error);
      }
    },

    async searchTask() {
      console.log(this.normalSearch.keyWord, "search");
      try {
        const id = this.projectId;
        const result = await ApiService(
          "/task/tasklist/" + id,
          "POST",
          this.normalSearch
        );

        localStorage.setItem("search", this.normalSearch.keyWord);
        this.search_list = { task: result?.data };

        this.$router.push("/task-list");
      } catch (error) {
        console.log(error);
      }
    },

    async getUser() {
      try {
        const id = this.projectId;
        const data = {};
        const response = await ApiService(
          "/project/Usersprojects/" + id,
          "post",
          data
        );

        if (response.length !== 0) {
          this.user_list = response?.listView;
          console.log(this.user_list, "user list of project");
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },

    async getIssueType() {
      this.loaderValue = false;

      try {
        const response = await ApiService("/task/getIssue", "GET", null);
        this.loaderValue = true;

        if (response.length !== 0) {
          this.issue_list = response?.issueTotalList;
          console.log(this.issue_list, "issue data");
          this.data.issue_type = this.issue_list[0].issue_type_id;

          this.issues();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getCategory() {
      this.loaderValue = false;

      try {
        const response = await ApiService("/task/getcategory", "GET", null);
        this.loaderValue = true;

        if (response.length !== 0) {
          this.category_list = response?.categoryTotalList;
          this.categorylist();
        }
      } catch (error) {
        console.log(error);
      }
    },
    notify(id) {
      this.data.notify.push(id);
    },
    async ProjectStatus() {
      this.loaderValue = false;
      try {
        const id = this.projectId;

        const response = await ApiService(
          "/project/overallProjectStatus/" + id,
          "GET"
        );
        this.loaderValue = true;

        this.projectStatus = response;
        this.minDate = this.projectStatus.start_date;
        this.maxDate = this.projectStatus.end_date;
        if (response.statusCode == 50) {
          this.$router.push("/dashboard");
        }
        if (response.statusCode == 399) {
          this.$router.push("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    },

    submit() {
      this.formSubmitted = true;
    },

    async add() {
     

      if (this.$refs.form.validate()) {
        this.addForm = true;

        try {
          if(this.parent?.parent_task_id){
          this.data.parent_id = this.parent?.parent_task_id;}
          else
          this.data.parent_id=null
          this.addForm = false;

          const response = await ApiService("task/addTask", "POST", this.data);
          this.addtaskData = response;
          if (response.task_id) {
            Vue.$toast.success(" Task Created Successfully", {
              position: "top",
              queue: true,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });

            this.$router.push("/task-list");
          }
        } catch (error) {
          const response = error.response.data;
          this.addresponse(response, error);
        }

        try {
          let formData = new FormData();
          const URL = "/task/upload/" + this.addtaskData.task_id;
          formData.append("file", this.files);
          formData.append("file_name", encodeURIComponent(this.files?.name));

          if (this.addtaskData) {
            await http.post(URL, formData, "POST").then((response1) => {
              this.data = response1.data.error;
              this.addtaskfile = response1;
            });
          }
          this.isSubmit = false;
          this.dialog = false;
        } catch (error) {
          console.log(error);
        }
      }
    },

    addresponse(response, error) {
      if (response.statusCode == 50) {
        Vue.$toast.error("Project not found", {
          position: "top",
          queue: true,
          preventOpenDuplicates: 0,
          preventDuplicates: 0,
        });
        this.$router.push("/dashboard");
      } else if (response.statusCode == 1) {
        Vue.$toast.error("Mail not sent ", {
          position: "top",
          queue: true,
          preventOpenDuplicates: 0,
          preventDuplicates: 0,
        });
      } else if (response.statusCode == 1030) {
        Vue.$toast.warning("Already exist this task in the project ", {
          position: "top",
        });
      } else if (response.statusCode == 67) {
        Vue.$toast.warning("actual hours should be in 0 to 72 ", {
          position: "top",
          queue: true,
          preventOpenDuplicates: 0,
          preventDuplicates: 0,
        });
      } else if (response.statusCode == 82) {
        Vue.$toast.warning("Start date is less than projects start date ", {
          position: "top",
          queue: true,
          preventOpenDuplicates: 0,
          preventDuplicates: 0,
        });
      } else if (response.statusCode == 711) {
        Vue.$toast.error("File size should be less than or equal to 200MB", {
          position: "top",
          queue: true,
          preventOpenDuplicates: 0,
          preventDuplicates: 0,
        });
      } else if (response.statusCode == 35) {
        Vue.$toast.error("Subject is Required", {
          position: "top",
          queue: true,
          preventOpenDuplicates: 0,
          preventDuplicates: 0,
        });
      } else if (error.response.data.statusCode == 69) {
        Vue.$toast.warning(
          "Task description must have  at least 10 characters",
          {
            position: "top",
            queue: true,
            preventOpenDuplicates: 0,
            preventDuplicates: 0,
          }
        );
      } else if (
        error.response.data.statusCode == 1038 ||
        error.response.data.statusCode == 413
      ) {
        Vue.$toast.warning("Description too long", {
          position: "top",
          queue: true,
          preventOpenDuplicates: 0,
          preventDuplicates: 0,
        });
      } else if (
        error.response.data.statusCode == 44 ||
        error.response.data.statusCode == 43
      ) {
        Vue.$toast.warning("Description is not allowed to be empty", {
          position: "top",
          queue: true,
          preventOpenDuplicates: 0,
          preventDuplicates: 0,
        });
      }
    },

    async add1() {
      this.addForm = true;

      try {
        this.addForm = false;

        const response = await ApiService("task/addTask", "POST", this.data);
        this.addtaskData = response;
        Vue.$toast.success(" Task Created Successfully", {
          position: "top",
        });

        this.$router.push("/task-list");
      } catch (error) {
        const response = error.response.data;
        if (response.statusCode == 50) {
          Vue.$toast.error("Project not found", {
            position: "top",
          });
          this.$router.push("/dashboard");
        } else if (response.statusCode == 1) {
          Vue.$toast.error("Mail not sent ", {
            position: "top",
          });
        } else if (response.statusCode == 1030) {
          Vue.$toast.warning("Already exist this task in the project ", {
            position: "top",
          });
        } else if (response.statusCode == 67) {
          Vue.$toast.warning("actual hours should be in 0 to 72 ", {
            position: "top",
          });
        } else if (response.statusCode == 82) {
          Vue.$toast.warning("Start date is less than projects start date ", {
            position: "top",
          });
        } else if (response.statusCode == 75) {
          Vue.$toast.warning("End date must be greater than start date ", {
            position: "top",
          });
        } else if (error.response.data.statusCode == 1038) {
          Vue.$toast.warning("Description too long", {
            position: "top",
          });
        } else if (error.response.data.statusCode == 69) {
          Vue.$toast.warning(
            "Task description must have  at least 10 characters",
            {
              position: "top",
            }
          );
        } else if (
          error.response.data.statusCode == 44 ||
          error.response.data.statusCode == 43
        ) {
          Vue.$toast.warning("Description is not allowed to be empty", {
            position: "top",
          });
        }
      }

      try {
        let formData = new FormData();
        const URL = "/task/upload/" + this.addtaskData.task_id;

        formData.append("file", this.files);
        formData.append("file_name", encodeURIComponent(this.files?.name));
        if (this.addtaskData) {
          await http.post(URL, formData, "POST").then((response1) => {
            this.data = response1.data.error;
          });
        }
        this.isSubmit = false;
        this.fileSubmit = false;
        this.dialog = false;
      } catch (error) {
        console.log(error);
      }
    },

    setItNull() {
      this.normalSearch.keyWord = "";
      this.tasksearch();
    },
    handleFileUploads($event) {
      if ($event == null) {
        this.error = "";
        this.num = 0;
      }
      console.log("23456u", $event);
      this.file = $event[0];
      this.files = $event;
      let fileType = $event.type;
      let fileName = $event.name;
      if (
        fileType != "image/png" &&
        fileType != "image/jpeg" &&
        fileType != "image/jpg" &&
        fileType != "application/pdf" &&
        fileType != "video/mp4" &&
        fileType != "text/csv"
      ) {
        this.error =
          "File type not supported. Supported types are: png, jpg, jpeg, csv, pdf, mp4";
        this.num = 1;
      } else if (fileName) {
        let x = "";
        console.log("*****", fileName.length);
        let name = fileName.split(".");
        name.splice(-1);
        name.forEach(function (value) {
          x = x + "." + value;
        });
        if (x.length - 1 > 150) {
          this.error = "File name should not exceed 150 characters";
          this.num = 1;
        } else {
          this.error = "";
          this.num = 0;
        }
      } else {
        this.error = null;
      }
    },

    findcategorytype(value) {
      if (value == null) {
        return null;
      } else {
        let assigneeSelected = this.category_list.filter((item) => {
          if (item.category_id == value) {
            return item;
          }
        });
        return assigneeSelected[0].category;
      }
    },
    findIssuetype(value) {
      if (value == null) {
        return null;
      } else {
        let assigneeSelected = this.issue_list.filter((item) => {
          if (item.issue_type_id == value) {
            return item;
          }
        });
        return assigneeSelected[0].issue_type;
      }
    },
    findPrioritytype(value) {
      if (value === 1) {
        return "Low";
      } else if (value === 2) {
        return "Normal";
      } else if (value === 3) {
        return "High";
      }
    },
    keyCheck() {
      this.addForm = true;
    },
    checking() {
      this.addForm = true;
      if (this.data.actual_hours == "") {
        this.data.actual_hours = null;
      }
      if (this.data.estimated_hours == "") {
        this.data.estimated_hours = null;
      }
    },
    searcchClr() {
      localStorage.removeItem(this.search);
    },
    async handleClick(item) {
      this.parent.parent_task_id = item?.task_id;
      this.parent.parent_task = item?.task_name;

      this.dialog = false;
    },
    truncate(str, length) {
      if (str.length > length) {
        return str.substring(0, length) + "...";
      } else {
        return str;
      }
    },
    closeDialog() {
      this.$refs.form1.reset();
      this.dialog = false;
    },

    ClrSelect() {
      console.log("hi hello");
      this.tasksearch();
      console.log("hi hello122");
    },
  },
  watch: {
    searchKey: function () {
      this.searchTask();
    },
  },
  mounted() {
    localStorage.removeItem("search");
    this.projectId = this.$store.state.projectId;
    localStorage.setItem("projectId", this.projectId);
    if (this.projectId === "null") {
      this.$router.push("/dashboard");
    }
    this.data.project_id = Number(this.projectId);
    this.handleClick();
    this.previeClick();
    this.ProjectStatus();
    this.keyCheck();
    this.getUser();
    this.getIssueType();
    this.getCategory();
    this.ToggleOnOff(localStorage.getItem("is_expanded") === "true");
    this.data.priority = this.priority[0].value;
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
    issues() {
      this.issue_list?.map((data) => {
        this.issuedata.push({
          value: data?.issue_type_id,
          text: data?.issue_type,
        });
      });
      return this.issuedata;
    },
    categorylist() {
      this.category_list?.map((data) => {
        this.categorydata.push({
          value: data?.category_id,
          text: data?.category,
        });
      });

      return this.categorydata;
    },
    Users() {
      let users = [];

      this.user_list?.map((data) => {
        users.push({
          value: data?.user?.user_id,
          text: data?.user?.user_name,
        });
        console.log(users, "users");
      });

      return users;
    },
    getissueId(name) {
      let id = 0;
      this.issue_list?.map((data) => {
        if (name == data?.issue_type_id) {
          id = data?.issue_type;
        }
      });
      return id;
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
    isReadonly() {
      return Boolean(this.parent.parent_task);
    },
  },
};
</script>

<style scoped>
@import "https://demo.dashboardpack.com/architectui-html-free/main.css";
.cardMsg {
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}

.hour-rem {
  float: right;
}

.project {
  height: 20px;
  background-color: black;
}

.NameAvtar {
  margin-left: 60%;
}

.bgcolorr {
  background-color: black;
}
.error-show {
  color: red;
}
#Add {
  font-size: x-large;
  font-weight: bold;
  margin-left: 40%;
  margin-bottom: -2%;
}

label {
  font-weight: 300;
  font-size: large;
}

.form {
  margin-left: 5%;
  margin-bottom: 3%;
}

.box {
  box-shadow: #4fa5d6 0px 0px 0px 2px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
  border: 2px solid;
  border-color: blue;
}
.inputFile input[type="file"] {
  z-index: -1;
  position: absolute;
  opacity: 0;
}
.inputFile input:focus + label {
  outline: 2px solid;
}
#allignment {
  word-break: break-all;
  overflow: scroll;
  height: 20px;
}
#alignment {
  word-break: break-all;
}

.description {
  word-wrap: break-word;
}
.ck-editor__editable {
  min-height: 100px;
  max-height: 100px;
}
.danger {
  color: red;
}

.grid {
  margin-top: 2%;

  border-bottom: 1px solid rgb(124, 109, 109);
}
.discgrid {
  margin-top: 2%;

  border-bottom: 1px solid rgb(124, 109, 109);
}
.previewbtn {
  margin-top: 2%;
}
.previewpg {
  margin-top: 3%;
  height: 100%;
  background-color: whitesmoke;
}
.parentissue {
  margin-top: 2%;
}
.addTask {
  margin-top: 2%;

  width: 100%;
  justify-content: center;
}
.subdiv {
  margin-top: 2%;
  border: 1px solid #4fa5d6;
}
.parentIssuediv {
  width: 100%;
  height: 10%;
  margin-top: 3%;
  flex-direction: row;
}

input {
  outline: none;
  border: none;
}

.wrap {
  width: 40px;
  height: 40px;
  position: relative;
  top: 0;
  left: 0;
  border-radius: calc(240px / 2);
  overflow: hidden;

  transition: width 0.3s ease-in-out;
}

.wrap svg {
  cursor: pointer;
  float: right;
}

.TaskBtn {
  display: flex;
  justify-content: end;
  gap: 10px;
}
.wrap .search {
  position: absolute;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  width: 200px;
  height: 22px;
  background-color: transparent;
  font-size: 16px;
  padding: 4px 0;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

#toggle:checked + label .wrap {
  width: 260px;
  box-shadow: 4px 2px 6px rgba(0, 0, 0, 0.3);
}
.AddparenttextDiv {
  margin-top: 1%;
  margin-left: 1%;
  max-width: 20%;
}

#toggle:checked + label .wrap .search {
  transition: opacity 0.3s ease-in-out 0.3s;
  opacity: 0;
}

#toggle {
  display: none;
}
.issuelabel {
  margin-top: 1.5%;
  margin-left: 2%;
}
#issuelabel1 {
  margin-top: 1.1%;
  margin-left: 1%;
  margin-bottom: 2.2%;
  box-shadow: none;
}

#searching {
  width: 23%;

  height: 40px;
}
.align-text {
  justify-content: right;
  margin-right: 4%;
  margin-bottom: 1%;
}
.align-item {
  justify-content: right;
  margin-right: 5%;
}
.tasks {
  word-break: break-all;
}
.fixed-sidebar .app-main .app-main__outer {
  z-index: 9;
  margin-left: 220px;
  padding-left: 0px;
}
#HeaderTask {
  max-height: 57px;
}
#searchBarIconsTask {
  display: flex;
  justify-content: end;
  max-width: 1500px;
  margin-top: -45px;
}
@media only screen and (max-width: 1450px) {
  .logo {
    width: 40px;
  }

  .names {
    font-size: 14px;
    white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      margin-top: -7px;
  }
}
.names {
    font-size: 14px;
    white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      margin-top: -7px;
  }
.errortask {
  color: red;

  margin-left: -1160px;
  margin-top: 59px;
  font-weight: 350;
  font-size: small;
}
.cmnbtnstyle1 {
  width: 170px;
  margin-left: 1%;
  height: 40px !important;
}
.fileFlex {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#fileInput {
  width: 500px;
}
.labels {
  font-family: "Open Sans", sans-serif;
}
.Toptitle {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
  background-color: #fff !important;
}
#for_preview {
  background-color: #ffffff;
  max-width: 80%;
  width: 100%;
  margin-left: 10%;
  -webkit-box-shadow: 0px 0px 7px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 7px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 7px -1px rgba(0, 0, 0, 0.75);
  height: 100%;
}
.preview_flw {
  background-color: #f1f4f6;
}

#for_preview span {
  color: rgb(79, 165, 214);
}
#pageTitle {
  height: 50px;
}
#searchTask {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
}

.taskcontent {
  width: 100%;
  margin-left: 1%;
  border: 1px solid gray;
  padding: 2rem;
}
.taskassignee {
  height: 20%;

  display: flex;
  justify-content: space-between;
}

.gridleft {
  margin-top: 3%;
  border-bottom: 1px solid rgb(124, 109, 109);
}
.gridright {
  margin-top: 3%;
  border-bottom: 1px solid rgb(124, 109, 109);
}
.gridleft1 {
  margin-top: 3%;

  border-bottom: 1px solid rgb(124, 109, 109);
}
.gridright1 {
  margin-top: 3%;

  border-bottom: 1px solid rgb(124, 109, 109);
}
.upbtn {
  width: 100%;
  margin-top: 2%;
  box-shadow: none;
}
.attachment {
  margin-top: 2%;
}
.previewBtn {
  display: flex;
  justify-content: end;
  gap: 10px;
}
.browseSearch {
  margin-top: -3%;
  margin-left: 42%;
}

.cmts {
  margin-top: 1%;
  margin-bottom: 7%;
}
#btnshadow1 {
  border: 1px solid grey;
}
#descVhtml {
  margin-left: 15px;
}
.v-application p {
  word-break: break-all;
  margin-left: -1%;
}
.cardss {
  margin-left: 1%;
}
.fileAlign {
  margin-top: 1%;
}

.fileName {
  margin-left: -17%;
}
@media (max-width: 991.98px) {
  .app-page-title .page-title-heading,
  .app-page-title .page-title-wrapper {
    margin: 0;
    display: flex !important;
    flex-wrap: wrap;
  }

  #searching {
    margin-top: 7%;
    width: 100%;

    height: 40px;
  }
  #addtaskform {
    margin-top: 20%;
  }
  .addTask {
    margin-top: 5%;
    width: 100%;
    justify-content: center;
  }
  .subdiv {
    /* margin-top: 7%; */
    gap: 15px;
    border: 1px solid #4fa5d6;
  }
  .parentIssuediv {
    width: 100%;
    height: 10%;
    margin-top: 3%;
    flex-direction: row;
    padding: 6%;
  }
  .previewDiv {
    margin-top: 20%;
  }
  .previewBtn {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .TaskBtn {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .AddparenttextDiv {
    margin-top: 1%;
    margin-left: 1%;
    max-width: 66%;
  }
  #issuelabel1 {
    margin-top: 1.1%;
    margin-left: 0%;
    display: flex;
    justify-content: center;
    margin-bottom: 2.2%;
    box-shadow: none;
    width: 101px;
    height: 26px !important;
  }

  .browseSearch {
    margin-top: -3%;
    margin-left: 0%;
  }

  .cmnbtnstyle1 {
    width: 100px;
    margin-left: 1%;
    height: 25px !important;
    font-size: small;
  }

  .v-btn.v-size--default,
  .v-btn.v-size--large {
    font-size: 9px !important;
  }
  .v-menu__content {
    transform-origin: left !important;
    position: absolute;
    display: inline-block;
    max-width: 80%;
    overflow-y: auto;
    overflow-x: hidden;
    contain: content;
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
      0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
    border-radius: 4px;
  }
}
@media (max-width: 600px) {
  .v-menu__content {
    left: 71px !important;
    transform-origin: left !important;
    position: absolute;
    display: inline-block;
    max-width: 80%;
    overflow-y: auto;
    overflow-x: hidden;
    contain: content;
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
      0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
    border-radius: 4px;
  }

  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 300px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: -7px;
  }
}

.v-text-field__slot {
  background: red !important;
  color: red;
}
.endDateHere .v-menu__content{
  left:530px!important;
}
#endDateMenu{
  left:500px;
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
