<template>
  <v-dialog persistent v-model="dialogCompose" width="700">
    <template v-slot:activator="{ on, attrs }">
      <button
        v-bind="attrs"
        v-on="on"
        type="button"
        tabindex="0"
        class="dropdown-item"
        @click="getIssueType() "
      >
        Issue Type Management
      </button>
    </template>
    <v-card class="overflow-visible" color="#FFFFFF">
      <v-toolbar flat color="#4FA5D6">
        <v-toolbar-title style="color: white">
          Issue Type Management
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialogCompose = false" dark>
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-toolbar>
      <br />

      <!--------------------------------Add New Issue type------------------------------------------------------>
      <v-dialog v-model="dialog" persistent max-width="600">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="addbtn"
            rounded
            color="success"
            v-bind="attrs"
            v-on="on"
            title="Add Issue Type"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
        </template>

        <v-card v-if="dialog">
          <div id="title">
            <v-card-title>
              <span class="text-h5">Add New Issue Type</span>
              <v-spacer></v-spacer>

              <v-btn
                icon
                @click="
                  dialog = false;
                  close();
                "
                dark
              >
                <v-icon> mdi-close </v-icon>
              </v-btn>
            </v-card-title>
          </div>
          <br />
          <v-card-text>
            <v-container>
              <v-form
                ref="form"
                v-model="valid"
                @submit.prevent="submit"

                lazy-validation
                autocomplete="off"
              >
                <v-row class="issueadd">
                  <v-col>
                    <v-row>
                      <v-col sm="10" md="10">
                        <v-text-field
                          outlined
                          type="text"
                          id="name"
                          :rules="nameRules"
                          v-model="data.issue_type"
                          label="Issue Type Name"
                          dense
                         @keyup="valid=true"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-card-actions class="justify-center">
                  <v-btn
                  class="cmnbtnstyle"
                  color="#4fa5d6" 
                    @click="submit"
                    id="btnshadow"
                    :disabled="!valid"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <template>
        <!------------------------------- issue type---------------------------------------------->
        <div class="issuetable">
          <template v-if="!this.isFetching">
            <v-data-table
            :mobile-breakpoint="100"
              :headers="headers"
              :items=" issue_data"
              class="elevation-1"
            
              :group-desc="true"
              :items-per-page.sync="limit"
                :page.sync="currentPage"
                :server-items-length="totalissue"

            >
              <!--------------------Issue---------------------->
              <template v-slot:[`item.issue_type`]="{ item }">
                    <td v-if="item.issue_type_id == 1">
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
                      {{ item.issue_type}}
                    </v-btn>
                      </td>
                      <td v-if="item.issue_type_id == 2">
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
                            background-color:#478af5;
                          "
                        >
                        {{ item.issue_type }}
                        </v-btn>
                      </td>
                      <td v-if="item.issue_type_id == 3">
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
                        {{ item.issue_type }}
                        </v-btn>
                      </td>
                      <td v-if="item.issue_type_id == 4">
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
                            background-color: #d9991a;
                          "
                        >
                        {{ item.issue_type }}
                        </v-btn>
                      </td>
                      <td v-if="item.issue_type_id !=1 && item.issue_type_id !=2&&item.issue_type_id !=3&&item.issue_type_id !=4">
                      
                        {{ item.issue_type }}
                      
                      </td>
            </template>
              <template v-slot:[`item.action`]="{ item }">
                <v-row v-if="item.issue_type_id > 4">
                  <div style="display: flex">
                    <template>
                      <v-icon
                        class="mr-3"
                        color="blue"
                        @click="editmodal(item)"
                        title="Edit"
                        >mdi-pencil</v-icon
                      >
                    </template>

                    <template>
                      <v-icon
                        class="mr-3"
                        color="red"
                        @click="openModal(item)"
                        title="Delete"
                        >mdi-delete</v-icon
                      >
                    </template>
                  </div>
                </v-row>
              </template>
            </v-data-table>
            <br>
          </template>
        </div>
        <!--------------------------Edit Dialogu-------------------------------------->
        <v-dialog v-model="editDialog" persistent max-width="600">
          <v-card v-if="editDialog">
            <div id="title">
              <v-card-title>
                <span class="text-h5">Edit Issue Type</span>
                <v-spacer></v-spacer>

                <v-btn
                  icon
                  @click="
                    editDialog = false;
                    close();
                  "
                  dark
                >
                  <v-icon> mdi-close </v-icon>
                </v-btn>
              </v-card-title>
            </div>
            <br />
            <v-card-text>
              <v-container>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  autocomplete="off"
                  @submit.prevent="editissue"
                >
                  <v-row class="issueadd">
                    <v-col>
                      <v-row>
                        <v-col sm="10" md="10">
                          <v-text-field
                            outlined
                            type="text"
                            id="name"
                            @change="changeissue(item,$event)"
                            :rules="nameRules"
                            v-model="issueeditdata.issue_type"
                            label="Issue Type Name"
                            dense
                           
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-card-actions class="justify-center">
                    <v-btn
                    class="cmnbtnstyle"
                      color="#4fa5d6"
                      @click="editissue"
                      id="btnshadow"
                      :disabled="valid==false"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!----------------------------Delete-------------------------------------------->
        <v-dialog v-model="confirmation" persistent max-width="400">
          <v-card>
            <v-card-title class="text-h5"> </v-card-title>

            <v-card-text>
              Are you sure you want to delete this record?
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red" text @click="onClose()"> No </v-btn>

              <v-btn color="green darken-1" text @click="dlt()"> Yes </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--------Replace------------------ -->

        <v-dialog v-model="Re_confirmation"  persistent max-width="30%">
          <v-card>
            <v-card-title class="text-h6">
              Choose an issue type for replace
            </v-card-title>

            <v-card-text>
              <form 
              ref="form"  v-if="Re_confirmation">
              <v-autocomplete
                background-color="white"
                :items="issueslist"
                v-model="dltissue.issue_type"
                label="Issue Type"
                :rules="replaceissueType"
                outlined
                dense
                style="margin-top: 10%"
                hide-selected
                v-on:change="valid=true"
              ></v-autocomplete></form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red" text @click="onClose()"> No </v-btn>

              <v-btn color="green darken-1" text @click="ReConfirmDelete()" :disabled="valid==false">
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-card>
  </v-dialog>
</template>
<script>
import ApiService from "../../service/apiservice";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
export default {
  components: {},
  data() {
    return {
      valid:false,
      isFetching: false,
      issuedata: [],
      tempissuedata: [],
      dialogCompose: false,
      dialog: false,
      editDialog: false,
      deleting_issue:"",
      reponseissue: "",
      issue_filter:[],
      first_modal:[],
      currentpage:1,
      data: {
        issue_type: "",
      },
      confirmation: false,
      Re_confirmation: false,
      currentPage: 1,
      prePage: 1,
      limit: 10,
      totalissue:'',
      issue_data:[],

      headers: [
        {
          text: "ID",
          color: "red",
          value: "issue_type_id",
          sortable: false,
          align: "start",
          width: "30%",
        },
        {
          text: " Issue Type",
          sortable: false,
          value: "issue_type",
          width: "50%",
        },
        {
          text: " Task count",
          sortable: false,
          value: "TaskCount",
          width: "30%",
        },

        { text: "Action", value: "action", sortable: false, width: "30%" },
      ],
      dltissue: {
        issue_type_id: "",
        issue_type: "",
        TaskCount: "",
      },
      issueeditdata: {
        issue_typ_id: "",
        issue_type: "",
      },
      issue_list: [],
      nameRules: [
        (v) => !!v || "Issue type is required",
        (v) => !/^\s/.test(v) || "Enter a valid Issue type name",
     


        (v) => /^(?! )(?!\s)(?!.* {2} )[\s\S]*(?<!\s)(?! )$/.test(v)||"Enter a valid Issue type name ",
        (v) =>
          (v.length >=3 && v.length <= 15) ||
          "Name must be between 3-15 characters",
      ],
      replaceissueType:[(v) => !!v || "Issue type to replace is required",]
    };
  },
  methods: {
    async getIssueType() {
   
    
      try {
        this.limits=this.limit
        if(this.limit==-1){
          this.limits=""
        }
        const params = { 
          limit: this.limits,
          page: this.currentPage,
       
        last_data:null
    };
        const response = await ApiService("/task/getIssue", "GET",null,null ,params);
      
        if (response.length !== 0) {
        this.issue_data = response?.issueTotalList;
        this.totalissue = response.totalCount;

        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    async submit() {
      this.valid =false;
      if (this.$refs.form.validate()) {
        try {
           await ApiService(
            "/task/addIssueType",
            "POST",
            this.data
          );
  
          
            Vue.$toast.success("Issue Type Added Successfully", {
              position: "top",
              duration: 1000,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
          
            this.valid = false;
            this.dialog = false;
            this.getIssueType();
            this.$refs.form.reset();
      
        } catch (error) {
          console.log(error);
          const response=error.response.data
          if (response.statusCode == 630) {
            this.valid = false;
            Vue.$toast.warning("Issue Type is Required", {
              position: "top",
              duration: 1000,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
            this.dialog = true;
          } else if (response.statusCode == 1510) {
            this.valid = false;
            Vue.$toast.warning("Issue Type already exists", {
              position: "top",
              duration: 1000,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
            this.valid = false;
            this.dialog = true;
          }
        }
      }
    },

    editmodal(item) {
     
      this.editDialog = true;

      this.issueeditdata.issue_type_id = item.issue_type_id;
      this.issueeditdata.issue_type = item.issue_type;
    },
    close() {
      this.$refs.form.reset();
    },

    closeedit() {
      this.$refs.form.reset();
      this.editDialog = false;
      console.log(document.body);
    },

    async editissue() {
      this.valid = false;
      try {
        const udata = {
          issue_type: this.issueeditdata.issue_type,
        };
        
        await ApiService(
          "/task/editIssueType/" + this.issueeditdata.issue_type_id,
          "PUT",
          udata,
          null,
          null
        );
  
          Vue.$toast.success("Issue updated Successfully", {
            position: "top",
            duration: 1000,
          });
          this.editDialog = false;
         await this.getIssueType();
      
      } catch (error) {
        console.log(error, "error................");
        const response=error.response.data
        if (response.statusCode == 1510) {
          this.valid = false;
          Vue.$toast.warning("Issue type name must be unique", {
            position: "top",
            duration: 1000,
          });
          this.editDialog = true;
        }
        if (response.statusCode == 1015) {
          this.valid = false;
          Vue.$toast.warning("Issue Type already exists", {
            position: "top",
            duration: 1000,
          });
          this.editDialog = true;
        }
        if (response.statusCode == 95) {
          this.valid = false;
          Vue.$toast.warning("issue name is required", {
            position: "top",
            duration: 1000,
          });

          this.editDialog = true;
        }
      
      }
    },
    onEnter(){
      this.dialog = true;
      this.editDialog = true;
    },
    
    async getAllissue() {
      try{

        const response = await ApiService("/task/getIssue", "GET");
      
      {
          this.first_modal = response.issueTotalList;
    
      this.totalissue = response.totalCount;


        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    openModal(item) {
      this.confirmation = true;

      this.dltissue.issue_type_id = item.issue_type_id;
      this.dltissue.issue_type = item.issue_type;
      this.dltissue.TaskCount = item.TaskCount;
      this.getAllissue();
      
    },
    onClose() {
   
      this.confirmation = false;
      this.Re_confirmation = false;
      // this.$refs.form.reset()
      this.issue_type_id = null;
    },
    async dlt() {
      this.confirmation = false;

      try {
        const data = {
          replace_issueType: null,
        };
        const URL = `/task/deleteIssueType/${this.dltissue.issue_type_id}`;
         await ApiService(URL, "PUT", data);

        
        
          Vue.$toast.success("Issue type Deleted Successfully", {
            position: "top",
          });
          this.getIssueType();
        
      } catch (error) {
        console.log(error);
        const response=error.response.data
        if (response.statusCode == 1590) {
          this.deleting_issue = this.dltissue.issue_type_id;
          this.issue_list = this.issueslist
          

          this.Re_confirmation = true;
          this.confirmation = false;
        }
      }
    },
    async ReConfirmDelete() {
      this.Re_confirmation = false;

      try {

        const data = {
          replace_issueType: this.dltissue.issue_type,
        };
        const URL = `/task/deleteIssueType/${this.dltissue.issue_type_id}`;

        await ApiService(URL, "PUT", data);

         
          Vue.$toast.success("Issue Type Deleted Successfully", {
            position: "top",
            queue:true,
          });
       


        this.getIssueType();
      } catch (error) {
        console.log(error);
        const response=error.response.data
        if (response.statusCode == 1514) {
          Vue.$toast.warning(
            "Cant Replace the issue type that you want to delete ",
            {
              position: "top",
              
            }
          );
          this.valid=false

          this.Re_confirmation = true;
        }
      }
    },
   
    
  },
  watch: {
    currentPage: {
      handler() {
        this.getIssueType();
      },
      immediate: false,
    },
    limit: {
      handler() {
        this.changeValue = true;
        this.getIssueType();
      },
      immediate: false,
    },
  },
  
 
  computed: {
    issueslist() {
     
 
      return this.first_modal?.filter(
          (data) => data.issue_type_id  != this.dltissue.issue_type_id
      ).map(_item => { 
        return {
          "text": _item.issue_type, 
          "value": _item.issue_type_id
        }
    })
     
    },
  },
};
</script>




<style scoped>
#title {
  background-color: #4fa5d6;
  color:#ffff;
}
#imp {
  color: red;
}
.v-text-field {
  margin-left: 5%;
  height: 20%;
}
.label {
  font-size: medium;
}

.datatable {
  width: 90%;
  margin-left: 5%;
}
.search {
  display: flex;
}
.addbtns {
  display: flex;
  justify-content: end;
}
.heading2 {
  justify-content: space-between;
  width: 100%;
}

.ttl {
  margin-top: 13px;
}
.srch {
  margin-left: -51px;
  margin-right: 13px;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 45px;
  min-width: 60px;
  padding: 0 16px;
}
.theme--light.v-icon:focus::after {
  opacity: 0 !important;
}
/* .datatable{
  overflow-y: hidden;
} */
.addbtn {
  margin-left: 84%;
}

.issuetable {
  margin-top:2%;
  margin-left: 8%;
  max-width: 85%;

}
.issueadd {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: 18px;
  margin-top: 2%;
}

.cmnbtnstyle{
 width:110px;
 height: 40px !important;

}


@media screen and (max-width:600px){
  .addbtn {
  margin-left: 75%;
}
.issuetable {
  margin-top:3%;
  margin-left: 8%;
  max-width: 85%;

}
}


@media screen and (max-width:280px){
  .addbtn {
  margin-left: 70%;
}
.issuetable {
  margin-top:3%;
  margin-left: 8%;
  max-width: 85%;

}
}


</style>
