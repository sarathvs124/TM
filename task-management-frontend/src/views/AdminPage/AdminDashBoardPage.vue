<template>
  <div
    class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header"
  >
    <!-- top nav -->
    <topNavigation />

    <div class="app-main backgroundColor">
      <!-- side nav -->

      <div class="app-main__inner">
        <div class="MainTitle" style="background-color: #f0f0f0">
      
            <router-link to="/dashboard" style="background: none">
              <v-img
                src="../../assets/Images/logo.png"
                alt="logo"
                width="40"
              ></v-img
            ></router-link>
            <div class="companyName" >
              Innovature Technologies K.K
            </div>
        
        </div>

        <div class="row">
          <div class="col-md-12 col-lg-6 col-sm-12 col-xs-12">
            <div id="searchDiv">
            <v-text-field
              background-color="white"
            
              @keyup="search()"
              v-model="searchText"
              dense
              filled
              rounded
              clearable
              @click:clear="setItNull()"
              :class="{ closed: searchBoxClosed && !searchText }"
              placeholder="Search project "
              prepend-inner-icon="mdi-magnify"
              class="pt-6  expanding-search "
            ></v-text-field>
          </div>

            <p></p>

            <v-expansion-panels v-model="panel" multiple class="projectBox">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <div
                    class="card-header-tab card-header-tab-animation card-header"
                  >
                    <div class="card-header-title projectTitleTop">
                      <em
                        class="metismenu-state-icon fa fa-file-code-o caret-left"
                      ></em>
                      Projects
                    </div>
                  </div>
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <div v-if="ProjectLoaded.length == 0" class="DataCenter">
                    <p>No data available</p>
                  </div>
                  <div v-for="item in ProjectLoaded" :key="item.id">
                    <div v-if="projectid == item.project_id">
                      <div
                        @mouseover="getId(item.project_id)"
                        @mouseleave="mouseleave"
                      >
                        <div
                          class="card cardMsg mb-3 widget-content btn-grad projectListBOx"
                         id="projectlistdiv"
                        >
                          <div class="row">
                            <div
                              class="col-1 pinProject"
                              style="cursor: pointer"
                            >
                              <a
                                title="Pin to top"
                                @click="pin(item.project_id, item.pinned)"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="30"
                                  height="30"
                                  fill="currentColor"
                                  class="bi bi-pin-angle"
                                  viewBox="0 0 18 18"
                                >
                                  <path
                                    d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"
                                  />
                                </svg>
                              </a>
                            </div>
                            <div class="col-1">
                              <v-avatar>
                                <img
                                  src="../../assets/Images/logo.png"
                                  alt=""
                                />
                              </v-avatar>
                            </div>
                            
                            <div class="proMax2">    <a v-on:click="ProjectDetail(item.project_id)">{{ item.project_name }} </a></div>

                            <div class="col-10">
                              <a v-on:click="ProjectDetail(item.project_id)">
                                <div class="widget-content-outer">
                                  <div class="widget-content-wrapper">
                                    <div class="widget-content-left">
                                      <div class="widget-heading ProjectListName">
                                   <div class="proMax">{{ item.project_name }}</div>

                                        <div
                                          class="widget-subheading"
                                   id="subheaddingnav"
                                        >
                                          <ul class="header-menu nav menuItems">
                                            <li
                                              class="btn-group nav-item listItem menuItems"
                                              :class="{ 'foo-hover': menu3 }"
                                            >
                                              <router-link
                                                :to="'/task-list'"
                                                style="text-decoration: none"
                                              >
                                                <a
                                                  @click="
                                                    redirectUrl(item.project_id)
                                                  "
                                                  href="javascript:void(0);"
                                                  class="nav-link"
                                                  style="
                                                    color: white;
                                                    font-weight: bolder;
                                                  "
                                                  title="Task"
                                                >
                                                  Task
                                                </a>
                                              </router-link>
                                            </li>
                                            <li
                                              class="dropdown nav-item listItem"
                                              v-if="item.project_role != 5"
                                            >
                                              <router-link
                                                :to="'/add-task'"
                                                style="text-decoration: none"
                                              >
                                                <a
                                                  @click="
                                                    redirectUrl(item.project_id)
                                                  "
                                                  href="javascript:void(0);"
                                                  class="nav-link"
                                                  style="
                                                    color: white;
                                                    font-weight: bolder;
                                                  "
                                                  title="Add Task"
                                                >
                                                  Add Task
                                                </a>
                                              </router-link>
                                            </li>
                                            <li
                                              class="dropdown nav-item listItem"
                                            >
                                              <router-link
                                                :to="'/file'"
                                                style="text-decoration: none"
                                              >
                                                <a
                                                  @click="
                                                    redirectUrl(item.project_id)
                                                  "
                                                  href="javascript:void(0);"
                                                  class="nav-link"
                                                  style="
                                                    color: white;
                                                    font-weight: bolder;
                                                  "
                                                  title="Files"
                                                >
                                                  Files
                                                </a>
                                              </router-link>
                                            </li>
                                            <li
                                              class="btn-group nav-item listItem"
                                            >
                                              <router-link
                                                :to="'/gantt-chart'"
                                                style="text-decoration: none"
                                              >
                                                <a
                                                  @click="
                                                    redirectUrl(item.project_id)
                                                  "
                                                  href="javascript:void(0);"
                                                  class="nav-link"
                                                  style="
                                                    color: white;
                                                    font-weight: bolder;
                                                  "
                                                  title="Gantt Chart"
                                                >
                                                  Gantt Chart
                                                </a>
                                              </router-link>
                                            </li>
                                            <li
                                              class="btn-group nav-item listItem"
                                            >
                                              <router-link
                                                :to="'/board'"
                                                style="text-decoration: none"
                                              >
                                                <a
                                                  @click="
                                                    redirectUrl(item.project_id)
                                                  "
                                                  href="javascript:void(0);"
                                                  class="nav-link"
                                                  style="
                                                    color: white;
                                                    font-weight: bolder;
                                                  "
                                                  title="Board"
                                                >
                                                  Board
                                                </a>
                                              </router-link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </div>
                          </div>
                          <div class="col-1">
                            <div class="widget-content-right-top">
                              <router-link
                                :to="'/project-settings/members'"
                                style="text-decoration: none"
                              >
                                <a
                                  class="btn float-right"
                                  title="Project setting"
                                  @click="redirectUrl(item.project_id)"
                                >
                                  <v-icon
                                    v-bind="attrs"
                                    v-on="on"
                                    style="
                                      color: white;
                                      margin-top: -200%;
                                      margin-left: 100%;
                                    "
                                    >mdi-cog-outline</v-icon
                                  >
                                </a>
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="projectid !== item.project_id">
                      <div
                        @mouseover="getId(item.project_id)"
                        @mouseleave="hover = false"
                        :class="{ active: hover }"
                      >
                        <div class="card cardMsg mb-3 widget-content">
                          <div class="row">
                            <div class="col-1 pinProject">
                              <div v-if="item.pinned == 1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="30"
                                  height="30"
                                  fill="currentColor"
                                  class="bi bi-pin-angle"
                                  viewBox="0 0 18 18"
                                  @click="Pin(item.project_id, item.pinned)"
                                >
                                  <path
                                    d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div class="col-1" style="margin-left: -4%">
                              <v-avatar>
                                <img
                                  src="../../assets/Images/logo.png"
                                  alt=""
                                />
                              </v-avatar>
                            </div>
                            <div class="col-10">
                              <div class="widget-content-outer">
                                <div class="widget-content-wrapper">
                                  <div class="widget-content-left" style="word-break:break-all">
                                    <div class="widget-heading projctHeading ProjectListName">
                                      <a
                                        v-on:click="
                                          ProjectDetail(item.project_id)
                                        "
                                      >
                                        {{ item.project_name }}
                                      </a>
                                      <div class="widget-subheading">
                                        {{ item.project_code }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="items.length !== 0 && items.length !== 1">
                    <div v-if="length < items.length">
                      <v-btn
                        class="btn"
                        text
                        @click="loadMore"
                        style="
                          color: cornflowerblue;
                          font-size: 14px;
                          width: 100%;
                        "
                      >
                        <a title="Show more">
                          <span class="mdi mdi-chevron-down iconLoad"></span
                        ></a>
                      </v-btn>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <br /><br />

            <div>
              <v-text-field
            
                @keyup="searchQuestion()"
                v-model="searchKey"
                dense
                background-color="white"
                filled
                rounded
                clearable
                @click:clear="setItNullTask()"

                placeholder="Search Task"
                prepend-inner-icon="mdi-magnify"
                class="pt-6 expanding-search"
                :class="{ closed: searchBoxClosed && !searchText }"
              ></v-text-field>
            </div>
            <div class="mb-3 card">
              <v-expansion-panels v-model="task" multiple>
                <v-expansion-panel @click="scrollElementIntoView">
                  <v-expansion-panel-header>
                    <div
                      class="card-header-tab card-header-tab-animation card-header"
                      id="tasks"
                    >
                      <div class="card-header-title myTaskHeading">
                        My Tasks
                      </div>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="d-flex" style="align-items: center">
                      <div
                        class="page-title-heading"
                        style="font-size: 1rem; font-weight: 600"
                      >
                        Filter:
                      </div>

                      <v-card-text>
                        <v-chip-group
                          v-model="selection"
                          active-class="buttonColour white--text"
                          :mandatory="mandatory"
                          :column="column"
                        >
                          <v-chip
                            @click="TaskListFilter(0)"
                            active
                            class="chipset1"
                            >Assigned to me({{
                              taskDetail.assignedToMeCount
                            }})</v-chip
                          >

                          <v-chip @click="TaskListFilter(1)" class="chipset1"
                            >Created by me({{
                              taskDetail.createdByMeCount
                            }})</v-chip
                          >
                        </v-chip-group>
                      </v-card-text>
                    </div>

                    <div class="d-flex" style="align-items: center">
                      <div
                        class="page-title-heading"
                        style="font-size: 1rem; font-weight: 600"
                      >
                        Due Date:
                      </div>

                      <v-card-text>
                        <v-chip-group
                          v-model="due"
                          active-class="buttonColour white--text"
                          :mandatory="mandatory"
                          :column="column"
                        >
                          <v-chip
                            @click="dueDateFilter(0)"
                            active
                            class="chipset"
                            >All</v-chip
                          >
                          <v-chip
                            @click="dueDateFilter(1)"
                            active
                            class="chipset"
                            >4 Days</v-chip
                          >
                          <v-chip
                            @click="dueDateFilter(2)"
                            active
                            class="chipset"
                            >Due Today</v-chip
                          >
                          <v-chip
                            @click="dueDateFilter(3)"
                            active
                            class="chipset"
                            >Overdue</v-chip
                          >
                        </v-chip-group>
                      </v-card-text>
                    </div>

                    <div
                      class="card cardMsg mb-3 widget-content d-flex" 
                   
                    >
                      <div class="table-responsive">
                        <table
                          aria-describedby=""
                          class="align-middle mb-0 table table-borderless table-striped table-hover"
                        >
                          <taskList />

                          <thead>
                            <tr>
                              <th id="" style="width: 27%" class="text-left">
                                Project Name
                              </th>
                              <th
                                id="taskHeading"
                                class="text-left"
                                style="width: 20%"
                              >
                                Task Name
                              </th>
                              <th id="" style="width: 15%" class="text-left">
                                Priority
                              </th>
                              <th id="" style="width: 20%" class="text-left">
                                Status
                              </th>
                              <th id="" style="width: 20%" class="text-left">
                                Due
                              </th>
                            </tr>
                          </thead>

                          <tbody class="myTaskRows">
                            <tr
                              v-for="item in task_list"
                              :key="item.user_id"
                              @click="
                                handleClick(item.project_id, item.task_id)
                              "
                            >
                              <td class="text-left">
                                <div class="widget-content p-0">
                                  <div class="widget-content-wrapper">
                                    <div class="widget-content-left flex2">
                                      <div
                                        class="widget-heading"
                                        id="TaskProjectName"
                                      >
                                        {{ item.project_name }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td class="text-left">
                                <div class="widget-content p-0 center">
                                  <div class="widget-content-wrapper">
                                    <div class="widget-content-left flex2">
                                      <div
                                        class="widget-heading"
                                        id="TaskHeadingName"
                                      >
                                        <a :title="item.task_name">
                                          {{ item.task_name }}</a
                                        >
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td v-if="item.priority == 3" class="text-left">
                                <a title="High">
                                  <em
                                    class="fa fa-arrow-up"
                                    style="color: red"
                                    aria-hidden="true"
                                  ></em
                                ></a>
                              </td>
                              <td v-if="item.priority == 2" class="text-left">
                                <a title="Normal">
                                  <em
                                    class="fa fa-arrow-right"
                                    style="color: black"
                                    aria-hidden="true"
                                  ></em
                                ></a>
                              </td>
                              <td v-if="item.priority == 1" class="text-left">
                                <a title="Low">
                                  <em
                                    class="fa fa-arrow-down"
                                    style="color: gray"
                                    aria-hidden="true"
                                  ></em
                                ></a>
                              </td>

                              <td
                                v-if="item.task_status == 1"
                                class="text-left"
                              >
                              <v-btn
                          outlined
                          rounded
                          color="white"
                          width="80px"
                          height="20px"
                          class="statusOpen"
                        >
                          Open
                        </v-btn>
                              </td>
                              <td
                                v-if="item.task_status == 2"
                                class="text-left"
                              >
                              <v-btn
                          outlined
                          rounded
                          color="white"
                          width="80px"
                          height="20px"
                         class="statusinprogress"
                          
                        >
                          In Progress
                        </v-btn>
                              </td>
                              <td
                                v-if="item.task_status == 3"
                                class="text-left"
                              >
                              <v-btn
                          outlined
                          rounded
                          color="white"
                          width="80px"
                          height="20px"
                         class="statusresolved"
                        >
                          Resolved
                        </v-btn>
                              </td>
                              <td
                                v-if="item.task_status == 4"
                                class="text-left"
                              >
                              <v-btn
                          outlined
                          rounded
                          color="white"
                          width="80px"
                          height="20px"
                        class="statusclosed"
                        >
                          Closed
                        </v-btn>
                              </td>
                              <div v-if="item.end_date == null">
                                <td></td>
                              </div>
                              <div v-if="item.end_date !== null">
                                <div
                                  v-if="
                                    !(
                                      new Date(item.end_date) - new Date() >
                                      24 * 60 * 60
                                    )
                                  "
                                >
                                  <td style="color: red">
                                    {{ item.end_date }}
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      class="bi bi-fire"
                                      viewBox="0 0 16 16"
                                    >
                                      <path
                                        d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z"
                                      />
                                    </svg>
                                  </td>
                                </div>
                              </div>
                              <div
                                v-if="
                                  new Date(item.end_date) - new Date() >
                                  24 * 60 * 60
                                "
                              >
                                <td>
                                  {{ item.end_date }}
                                </td>
                              </div>
                            </tr>
                          </tbody>
                        </table>

                        <div v-if="!loadValue" class="loader"></div>
                        <div v-if="taskList.length == 0" class="DataCenter">
                          <p>No data available</p>
                        </div>

                        <div v-if="taskListLength > 10">
                          <button
                            class="btn float-right"
                            @click="loadLessTask"
                            style="color: cornflowerblue; font-size: 14px"
                          >
                            Load Less
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-if="totalTask > 10 && taskDetail.dataCount == 10">
                      <v-btn
                        class="btn"
                        text
                        @click="getTask"
                        style="
                          color: cornflowerblue;
                          font-size: 14px;
                          width: 100%;
                        "
                      >
                        <a title="Show more">
                          <span class="mdi mdi-chevron-down iconLoad"></span
                        ></a>
                      </v-btn>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>

          <div class="col-md-12 col-lg-6">
            <!------------------------- view options modal ---------------------------------->
            <template>
              <v-dialog v-model="dialog" scrollable max-width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <form class="search-container" action="">
                    <v-btn
                      style="
                        margin-left: 76%;
                        margin-right: 5%;
                        background-color: white;
                      "
                      rounded
                      small
                      v-bind="attrs"
                      v-on="on"
                      title="View options"
                      prepend-icon="mdi-add"
                      variant="outlined"
                      @click="ViewOptions"
                      outlined
                      class="chipset2"
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"
                        ></path>
                      </svg>

                      View Options
                    </v-btn>
                  </form>
                </template>
                <v-card>
                  <v-card-title style="background-color: #4fa5d6; color: white"
                    >View Options</v-card-title
                  >
                  <div class="text-filter" style="margin-bottom: 1%">
                    <span class="mr-2">Project</span>
                    <div
                      class="badge badge-success mr-2 "
                      style="border-radius: 60%; background-color: #2c9a7a;"
                    >
                      {{ demoProject.length }}
                    </div>
                    <a
                      href=""
                      @click.prevent="FilterUnSelect"
                      v-if="demoProject.length != 0"
                      style="font-weight: normal"
                      >Unselect</a
                    >
                  </div>

                  <v-card-text style="height: 300px">
                    <div class="box-filter" style="overflow: scroll">
                      <div v-for="item in itemss" :key="item.id">
                        <v-checkbox
                          color="success"
                          v-model="demoProject"
                          :value="item.project_id"
                          style="margin-bottom: -10%; margin-left: 5%"
                        >
                          <template v-slot:label>
                            <a :title="item.project_name">
                            <div class="checkText projectSelect">
                              {{ item.project_name }}
                            </div>
                            </a>
                          </template>
                        </v-checkbox>
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-actions center class="btnStyle">
                    <v-btn
                      class="cmnbtnstyle"
                      color="#4fa5h6"
                      @click="RecentUpdateFilterClose"
                    >
                      <span style="color: black"> Cancel </span>
                    </v-btn>
                    <v-btn
                      class="cmnbtnstyle SaveButton"
                      color="#4fa5d6"
                      @click="RecentUpdateFilter"
                    >
                      <span>Save</span>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>

            <div class="mb-3 card">
              <div class="card-header-tab card-header" style="margin-bottom: -21px;">
                <div class="card-header-title" style="background-color: transparent;">
                  <em
                    class="header-icon lnr-rocket icon-gradient bg-tempting-azure"
                  >
                  </em>
                  Recent Updates
                </div>
              </div>
              <div v-if="RecentUpdateArray.length==0" style="margin-left: 40%;">
                <p>No data Available</p>
              </div>
              
</div>

              <div v-for="group in activity" :key="group.id">
      <div class="box">
        <div class="card-header-tab card-header">
                <div class="card-header-title">
                  <em
                    class="header-icon lnr-rocket icon-gradient bg-tempting-azure"
                  >
                  </em>
                  {{ new Date(group.date).toDateString()}}                </div>
              </div>


          <div v-for="Data in group.data" :key="Data.id">
                <div class="card cardMsg widget-content">
                  <div></div>
                  <div class="widget-content-outer">
                    <div class="widget-content-wrapper">
                      <div class="widget-content-left" v-if="Data.action == 1">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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

                        <div class="Taskname newClass">
                          {{ Data.task_name }}
                        </div>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>
                      <div class="widget-content-left" v-if="Data.action == 2">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                        <div></div>
                      </div>
                      <div class="widget-content-left" v-if="Data.action == 3">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
                        </div>
                        <div class="widget-heading headingContent">
                          {{ Data.action_by }}
                          <v-badge
                            color="#4caf93"
                            content="Updated"
                            left
                            inline
                          ></v-badge>
                          a task
                        </div>
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>

                      <div class="widget-content-left" v-if="Data.action == 4">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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
                        <div class="widget-subheading newClass"></div>

                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>

                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>
                      <div class="widget-content-left" v-if="Data.action == 5">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>
                      <div class="widget-content-left" v-if="Data.action == 6">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>
                      <div class="widget-content-left" v-if="Data.action == 7">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                          <!-- Created Date: {{ Data.created_date }} -->
                        </div>
                      </div>
                      <div class="widget-content-left" v-if="Data.action == 8">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>
                      <div class="widget-content-left" v-if="Data.action == 9">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
                        </div>
                        <div class="widget-heading headingContent">
                          {{ Data.action_by }}
                          <v-badge
                            color="#4caf93"
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
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>
                      <div
                        class="widget-content-left"
                        style="width: 100%"
                        v-if="Data.action == 10"
                      >
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div style="margin-bottom: 0px" class="newClass">
                          <tr>
                            <td>Comment- &nbsp;</td>
                            <td
                              id="idd"
                              class="commentBox"
                              v-html="Data.comment"
                            ></td>
                          </tr>
                        </div>

                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>
                      <div class="widget-content-left" v-if="Data.action == 11">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
                        </div>
                        <div class="widget-heading headingContent">
                          {{ Data.action_by }}
                          <v-badge
                            color="#4caf93"
                            content="Changed"
                            left
                            inline
                          ></v-badge>
                          status
                        </div>
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>

                      <div class="widget-content-left" v-if="Data.action == 12">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>

                      <div class="widget-content-left" v-if="Data.action == 13">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
                        </div>
                        <div class="widget-heading headingContent">
                          {{ Data.action_by }}
                          <v-badge
                            color="primary"
                            content="Changed"
                            left
                            inline
                          ></v-badge>
                          status And Assignee
                        </div>
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>
                      <div class="widget-content-left" v-if="Data.action == 14">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
                        </div>
                        <div class="widget-heading headingContent">
                          {{ Data.action_by }}
                          <v-badge
                            color="primary"
                            content="renamed"
                            left
                            inline
                          ></v-badge
                          >a file
                        </div>
                        <router-link :to="'/task-view'" class="navPage">
                          <div
                            class="Taskname newClass"
                            @click="
                              redirectTaskUrl(Data.project_id, Data.task_id)
                            "
                          >
                            {{ Data.task_name }}
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>

                      <div class="widget-content-left" v-if="Data.action == 20">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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
                          <div
                            class="projectName newClass"
                            @click="ProjectDetail(Data.project_id)"
                          >
                            {{ Data.project_name }}({{ Data.project_code }})
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ Data.allocated_user_name }} has been added as a
                          {{ findRole(Data.allocated_role_id) }}
                        </div>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>

                      <div class="widget-content-left" v-if="Data.action == 21">
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
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
                          class="projectName newClass"
                          @click="ProjectDetail(Data.project_id)"
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
                        <div v-if="Data.profile_photo == null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img src="../../assets/dd.jpg" alt="" />
                          </v-avatar>
                        </div>
                        <div v-if="Data.profile_photo != null">
                          <v-avatar class="mr-3 ImageProfile">
                            <img v-bind:src="Data.profile_photo" alt="" />
                          </v-avatar>
                        </div>
                        <div class="widget-heading headingContent">
                          {{ Data.action_by }}
                          Edited the
                          <v-badge
                            color="pink accent-3"
                            content="Memebers"
                            left
                            inline
                          ></v-badge
                          >Of the project
                        </div>
                        <router-link :to="'/home'" class="navPage">
                          <div
                            class="projectName newClass"
                            @click="ProjectDetail(Data.project_id)"
                          >
                            {{ Data.project_name }}({{ Data.project_code }})
                          </div>
                        </router-link>
                        <div class="widget-subheading newClass">
                          {{ Data.allocated_user_name }} removed from the
                          project
                        </div>
                        <div class="widget-subheading newClass">
                          {{ moment(Data.created_date).fromNow() }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

          </div>
<br/>        

</div>


          

                <div v-if="TotalRecentTask != RecentUpdateArray.length">
                  <v-btn
                    class="btn "
                    text
                    @click="notification"
                    style="color: cornflowerblue; font-size: 14px; width:100%"
                  >
                  <a title="Show more"> <span class="mdi mdi-chevron-down iconLoad"></span></a>
                </v-btn>
              </div>

                
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import topNavigation from "./TopNav2.vue";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import ApiService from "../../service/apiservice.js";
import { BTooltip } from "bootstrap-vue";
Vue.component("b-tooltip", BTooltip);

let moment = require("moment");
export default {
  components: { topNavigation },
  data() {
    return {
      activity:[],
      RecentLastData:"",
      hasNext:"",
      RecentUpdateArray:[],
      TotalRecentTask:"",
      due: 0,
      mandatory: true,
      column: true,
      loadValue: false,
      commentValue: 1,
      moment: moment,
      selection: 0,
      userFilter: 0,
      dueDate: "",
      limit: 10,
      lastData: "",
      searchKey: "",
      menu: false,
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      pinId: "",
      taskListLength: 10,
      hover: false,
      panel: [0, 4],
      task: [0, 1],
      upHere: false,
      items: [],
      demoProject: [],
      projects: {
        projects: [],
      },

      confirmation: false,
      task_list: [],
      notificationList: [],
      dialogm1: "",
      length: 4,
      projectid: "",

      NotifyLength: "",
      notificationListLength: 5,
      dialog: false,

      searchText1: null,
      taskDetail: [],

      searchBoxClosed: false,
      datas: {
        project_id: null,
      },
    };
  },

  mounted() {
    localStorage.removeItem("projectRole");
    localStorage.removeItem("taskId");

    this.getProjectsList();
    localStorage.setItem("search", " ");
    setTimeout(() => {
      this.getTask();
    }, 1000);
  },
  methods: {
    // task redirction
    redirectTaskUrl(id, taskId) {
      localStorage.setItem("taskId", taskId);
      localStorage.setItem("projectId", id);
      this.$store.commit("getData", id);
      this.$store.commit("getTaskData", taskId);
    },

    redirectUrl(id) {
      localStorage.setItem("projectId", id);
      this.$store.commit("getData", id);
    },
    myFunction() {
      let dots = document.getElementById("dots");
      let moreText = document.getElementById("more");
      let btnText = document.getElementById("myBtn");

      if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.innerHTML = "Read more";
        moreText.style.display = "none";
      } else {
        dots.style.display = "none";
        btnText.innerHTML = "Read less";
        moreText.style.display = "inline";
      }
    },

    TaskListFilter(id) {
      this.userFilter = id;
      this.lastData = "";
      this.task_list = [];
      this.getTask();
    },
    async getProjectsList() {
      this.searchText = null;

      const responseProject = await ApiService("/project/getProject", "GET");
      if (typeof responseProject == "object") {
        this.items = responseProject.listView;
        this.itemss = responseProject.listView;
        for (const element of this.itemss) {
          this.projects.projects.push(element.project_id);
        }
        this.notification();
      } else {
        this.$router.push("/");
      }
    },
    async getTask() {
      this.loadValue = false;
      const params = {
        userFilter: this.userFilter,
        searchKey: this.searchKey,
        dueDate: this.dueDate,
        limit: this.limit,
        last_data: this.lastData,
      };
      const response = await ApiService(
        "/task/getTaskListDashboard",
        "GET",
        null,
        null,
        params
      );

      this.loadValue = true;

      this.taskDetail = response;






      for (const element of response.taskList) {
        this.task_list.push(element);
      }
      const length = this.task_list.length;
      if (this.userFilter == 0) {
        this.totalTask = response.assignedToMeCount;
      } else {
        this.totalTask = response.createdByMeCount;
      }
      this.lastData = this.task_list[length - 1].task_id;
    },
    async dlt() {
      const URL = `project/project/${this.project_id}`;
      const response = await ApiService(URL, "DELETE");
      if (response.status == 200) {
        Vue.$toast.success("Project Deleted Successfully", {
          position: "top",
        });
      }
      this.dlt = false;
    },
    loadMoreNotification() {
      if (this.notificationListLength > this.notificationList.length) return;
      this.notificationListLength = this.notificationListLength + 5;
    },
    loadLessNotification() {
      this.notificationListLength = this.notificationListLength - 5;
    },
    loadMore() {
      if (this.length > this.items.length) return;
      this.length = this.length + 4;
    },
    loadLess() {
      this.length = this.length - 4;
    },
    setItNullTask(){
      this.searchKey="";
      this.searchQuestion()
    },
    loadLessTask() {
      if (this.taskListLength < this.task_list.taskListLength) return;
      this.taskListLength = this.taskListLength - 10;
    },
    async notification() {
      this.step = this.step + 1;
      const params = {
        limit: 10,
        last_data: this.RecentLastData,
      };
      const response = await ApiService(
        "task/getRecentUpdatesDashboard",
        "POST",
        this.projects,
        null,
        params
      );
      if (this.RecentLastData == "") {
        this.TotalRecentTask = response.total;
      }
      this.notificationList = response.recentUpdates;


      for (const element of response.recentUpdates) {
        let activityIndex = this.activity.findIndex(x => x.date == element.group_date)
        if (activityIndex>=0) {
          this.activity[activityIndex].data.push(element)
        } else {

          this.activity.push({
            date: element.group_date,
            data: [element]
          })
        }


        this.RecentUpdateArray.push(element);
      }







if(this.notificationList[9].update_type==2){
  this.RecentLastData=this.notificationList[9].project_history_id

}else if(this.notificationList[9].update_type==1){
  this.RecentLastData=this.notificationList[9].task_history_id

}
      this.hasNext=response.hasNext
      this.NotifyLength = this.RecentUpdateArray.length;
    },

    ProjectDetail(id) {
      localStorage.setItem("projectId", JSON.stringify(id));
      this.$store.commit("getData", id);
      this.$router.push("/home");
    },
    ProjectSetting() {
      this.$router.push("/project-settings/members");
    },
    ProjectDelete(id) {
      this.dlt = true;
      this.project_id = id;
    },
    onClose() {
      this.confirmation = false;
      this.project_id = null;
    },
    handleClick(id, taskid) {
      localStorage.setItem("taskId", taskid);
      localStorage.setItem("projectId", id);
      this.$store.commit("getTaskData", taskid);
      this.$store.commit("getData", id);
      this.$router.push("/task-view");
    },
    getId(id) {
      this.projectid = id;
    },
    mouseleave() {
      this.projectid = "";
    },
    async pin(id) {
      try {
        this.datas.project_id = id;
        this.pinId = id;
        const responsePin = await ApiService(
          "/project/pinProject",
          "POST",
          this.datas
        );
        this.itemsss = responsePin.result;
        if (responsePin.statusCode == 200) {
          Vue.$toast.info("Pinned the Project", {
            position: "top",
            color: "red",
            icon: false,
            queue: true,
          });
        } else if (responsePin.statusCode == 201) {
          Vue.$toast.success("Unpinned from list", {
            position: "top",
            queue: true,
          });
        }

        this.getProjectsList();
      } catch (error) {
        console.log("Ssssss");
      }
    },
    setItNull() {
      this.searchText = "";
      this.search();
    },
    async search() {
      console.log("inside the funtion");
      this.down = true;

      this.DataLoaded = false;

      const params = {
        searchKey: this.searchText,
      };

      const response = await ApiService(
        "/project/getProject",
        "GET",
        null,
        null,
        params
      );
      this.DataLoaded = true;
      this.items = response.listView;

      this.pageCount = Math.ceil(response.total / 10);

      this.sideBar = this.$route.params.id;
    },

    searchQuestion() {
      this.task_list = [];

      this.lastData = "";

      this.getTask();
    },

    async RecentUpdateFilter() {
      this.dialog = false;
      if (this.demoProject.length == 0) {
        this.projects.projects = [];
        const responses = await ApiService("/project/getProject", "GET");

        this.itemss = responses.listView;
        for (const element of this.itemss) {
          this.projects.projects.push(element.project_id);
        }
      }
      if (this.demoProject.length != 0) {
        this.projects.projects = [];
        this.projects.projects = this.projects.projects.concat(
          this.demoProject
        );
      }
            this.RecentUpdateArray=[];
            this.activity=[];
            this.RecentLastData="";
this.NotifyLength=0;
this.notification();

    },
    dueDateFilter(id) {
      this.task_list = [];
      this.dueDate = id;
      this.lastData = "";

      this.getTask();
    },
    RecentUpdateFilterClose() {
      if (
        this.demoProject.length != this.projects.projects.length &&
        this.demoProject.length != 0
      ) {
        this.demoProject = [];
        this.demoProject = this.demoProject.concat(this.projects.projects);
      } else if (this.demoProject.length != 0) {
        this.projects.projects = [];
        this.projects.projects = this.projects.projects.concat(
          this.demoProject
        );
      }

      this.dialog = false;
    },
    findRole(id) {
      if (id === 3) {
        return "Project Admin";
      } else if (id === 4) {
        return "Project Manager";
      } else if (id === 5) {
        return "Developer";
      } else if (id === 6) {
        return "Reporter";
      } else if (id === 7) {
        return "Guest";
      }
    },
    FilterUnSelect() {
      this.projects.projects = [];
      this.demoProject = [];

      this.dialog = true;
    },

    scrollElementIntoView() {
      setTimeout(
        () =>
          document
            .getElementById("tasks")
            .scrollIntoView({ behavior: "smooth", block: "start" }),
        100
      );
    },
  },
  watch: {
    searchTask: function () {
      this.searchQuestion();
    },
    searchProject: function () {
      this.search();
    },
  },
  computed: {
    ProjectLoaded() {
      return this.items.slice(0, this.length);
    },
    NotificationLoaded() {
      return this.notificationList.slice(0, this.notificationListLength);
    },
    taskList() {
      return this.task_list.slice(0, this.taskListLength);
    },
  },
};
</script>

<style scoped>
@import "https://demo.dashboardpack.com/architectui-html-free/main.css";

.cardMsg {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
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
.active {
  transition-duration: 0.15s;
  transition-property: opacity;
}
.foo-hover {
  border-radius: 10%;

  background-color: rgb(55, 55, 55);
  color: rgb(255, 255, 255);
}

.search-container {
  padding: 40px;
}
.search-box {
  background: #fff;
  background-color: transparent;
  border-radius: 20px;
  border-width: 2px;
  border-style: solid;
  border-color: grey;
  cursor: pointer;
  height: 40px;
  transition: width 0.6s, border-radius 0.6s, background 0.6s, box-shadow 0.6s;
  width: 40px;
}
.search-box + label {
  max-width: 0;
}
.search-box + label .search-icon {
  color: grey;
  transition: all 0.6s;
}
.search-box:hover {
  background: #c8c8c8;
  box-shadow: 0 0 0 5px rgba(128, 128, 128, 0.1);
}
.search-box:hover + label .search-icon {
  color: white;
}
.search-box:focus {
  border: none;
  border-radius: auto;
  background: #ebebeb;
  box-shadow: none;
  color: black;
  cursor: text;
  outline: none;
  padding-left: 15px;
  transition: width 0.6s cubic-bezier(0, 1.22, 0.66, 1.39), border-radius 0.6s,
    background 0.6s;
  width: 300px;
}

.companyName{
    font-size: 20px;
     line-height: 2.8rem; 
     font-weight: 700
  }
.search-box:focus + label .search-icon {
  color: grey;
}
.search-box:not(:focus) {
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
}
.search-icon {
  cursor: pointer;
  left: -31px;
  position: relative;
  top: 2px;
}
.search-btn {
  display: none;
  position: relative;
}
.menuList {
  color: white;
  font-weight: bolder;
}
.btn-grad {
  background-image: linear-gradient(
    to right,
    #4fa5d6 0%,
    #4fa5d6 51%,
    #4fa5d6 100%
  );

  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
}

.btn-grad:hover {
  color: #fff;
}

.expanding-search {
 
  margin-left:65%;
  position: sticky;

  width: 35%;
}

.box-filter {
  border: outset 2px;
  border-radius: 8px;

  width: 100%;
  height: 90%;
}
.text-filter {
  font-size: 14px;
  margin-left: 10%;
  font-weight: bold;
  margin-top: 4%;
  margin-bottom: -2%;
}
.checked {
  background-color: #1d9c70;
}
.navPage {
  text-decoration: none;
  font-size: 15px;
  color: rgb(28, 28, 28);
}
.listItem:hover {
  background-color: #4b4b4b;
}
@media only screen and (max-width: 1440px) {
.ProjectListName{
  font-size: 13px !important;
}
  .projctHeading {
    margin-left: 15px;
  
  }
  .pinProject {
    margin-top: 10px;
    width: 20px;
  }
  .menuItems {
    color: white;
    font-size: 10px;
  }
  .listItem {
    text-align: center;
    height: 20%;
    border-radius: 15%;
    color: white;
  }
}
.tooltip-text {
  visibility: hidden;
  position: absolute;
  z-index: 1;
  width: 100px;
  color: white;
  font-size: 12px;
  background-color: #192733;
  border-radius: 10px;
  padding: 10px 15px 10px 15px;
}

.hover-text:hover .tooltip-text {
  visibility: visible;
}

#top {
  top: -40px;
  left: -50%;
}

#bottom {
  top: 25px;
  left: -50%;
}

#left {
  top: -8px;
  right: 120%;
}

#right {
  top: -8px;
  left: 120%;
}

.hover-text {
  position: relative;
  display: inline-block;
  margin: 40px;
  text-align: center;
}
.btnStyle{
  margin-left: 65px
}

.DataCenter {
  text-align: center;
}
.Taskname {
  word-break: break-all;
  color: rgb(121, 121, 121);
  font-weight: 600;
  font-size: 14px;
}
.projectName {
  color: rgb(121, 121, 121);
  font-weight: 600;
}
.comment p {
  margin-bottom: 0% !important;
}
.commentBox {
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
#more {
  display: none;
}

#taskHeading {
  max-width: 200px;
}
.openButton {
  width: 80px;
  border-radius: 50px;
  background-color: #ed8077 !important;
}
.inprogressButton {
  width: 80px;

  border-radius: 50px;
  background-color: #4488c5 !important;
}
.resolvedButton {
  width: 80px;

  color: white;
  border-radius: 50px;
  background-color: #5eb5a6 !important;
}
.closedButton {
  width: 80px;

  border-radius: 50px;
  background-color: #a1af2f !important;
}
.projectBox {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.backgroundColor {
  background-color: #f0f0f0;
}
#TaskHeadingName {
  white-space: nowrap;
  width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.buttonColour {
  background-color: rgb(79, 165, 214);
}
.myTaskRows {
  background-color: #ffffff;
}
.myTaskRows :hover {
  background-color: antiquewhite;
}

/* loader */

.loader {
  margin-left: 44%;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: transparent;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin89345 1s linear infinite;
}

@keyframes spin89345 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.chipset {
  width: 90px;
  justify-content: center;
}
.chipset1 {
  width: 145px;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badgestyle {
  width: 10px !important;
  justify-content: center;
}
.pinProject {
  margin-top: 10px;
}

#subheaddingnav{
  margin-bottom: -10%
}
.ImageProfile {
  width: 35px !important;
  height: 35px !important;
  margin-left: -5px;
}
.headingContent {
  margin-left: 40px;
  margin-top: -38px;
}
.newClass {
  margin-left: 40px;
}
.checkText {
  margin-top: 4px !important;
}
.iconLoad {
  font-size: 30px;
}
.projectTitleTop {
  margin-left: -16px !important;
}
.myTaskHeading {
  margin-left: -16px;
}

.SaveButton {
  color: white;
}
.cmnbtnstyle {
  border: #c2c2c2 1px solid;
  box-shadow: none;
}


.MainTitle {
  display: flex !important;
  flex-direction: row !important;
  justify-content: center;

}

#projectlistdiv{
  color: white ;  
  height: 100px;
}


@media all and (max-width: 770px) {
  .MainTitle {
    display: flex !important;
    flex-direction: row !important;
    justify-content: center !important;
    left: 2px;
  }

  .expanding-search {
 margin-left:0px;
    position: sticky;
    width: 100%;
}
.search-container {
  padding: 43px;
    margin-right: 45px;
}



}
@media screen and (max-width: 400px){
  #projectlistdiv{
  color: white ;  
  height: 200px !important;
}
  
}

.statusOpen{
  border: none;
  letter-spacing: 0px;
  font-weight: bold;

                            font-size: 12px;
                                                        text-transform: none;
                            background-color: #ed8077 !important;
}
.statusOpen :hover{
  background-color: transparent !important;

}
.statusinprogress{
  border: none;
  letter-spacing: 0px;
  font-weight: bold;

                            font-size: 12px;
                                                        text-transform: none;
                            background-color: #4488c5 !important;
}
.statusinprogress :hover{
  background-color: transparent !important;

}
.statusresolved{
  border: none;
  letter-spacing: 0px;
  font-weight: bold;

                            font-size: 12px;
                                                        text-transform: none;
                            background-color: #5eb5a6 !important;
}
.statusresolved :hover{
  background-color: transparent !important;

}
.statusclosed{
  border: none;
  letter-spacing: 0px;
  font-weight: bold;

                            font-size: 12px;
                            text-transform: none;
                            background-color: #a1af2f !important;
}

.statusclosed :hover{
  background-color: transparent !important;

}
.projectSelect{
  width: 270px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

@media screen and (max-width: 280px){
  .companyName{
    font-size: 15px;
     line-height: 2.8rem; 
     font-weight: 700
  }
  .search-container {
    padding: 43px;
    margin-right: 88px;
}
.btnStyle{
  margin-left: -15px
}
#projectlistdiv{
  color: white ;  
  height: 287px !important;
}

}

.proMax2{
  display: none;
   height: 26px;
    margin-left: 40px;
    margin-top: 34px;
}
@media screen and (max-width: 1011px){
  .proMax{
display: none;
  }
.proMax2{
  display: block;
}
#projectlistdiv{
  color: white ;  
  height: 135px;
}

#subheaddingnav{
  margin-bottom: 0%
}
}

</style>
