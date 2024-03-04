<template>
  <v-dialog persistent v-model="dialogCompose" width="700">
    <template v-slot:activator="{ on, attrs }">
      <button
        v-bind="attrs"
        v-on="on"
        type="button"
        tabindex="0"
        class="dropdown-item"
        @click="getCategory()"
        data-test="category"

      >
      Category Management
      </button>
    </template>
    <v-card class="overflow-visible" color="#FFFFFF">
      <v-toolbar flat color="#4FA5D6">
        <v-toolbar-title style="color: white"  data-test="category">  Category Management </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn  title="Close" icon @click="dialogCompose = false" dark>
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
            title="Add category"
            data-test="button"
          >
            <v-icon> mdi-plus </v-icon>
         
          </v-btn>
        </template>

        <v-card v-if="dialog">
          <div id="title">
            <v-card-title >
              <v-toolbar-title style="color: white"  data-test="newCategory">  Add New Category </v-toolbar-title>
              <!-- <span class="text-h5" >Add New Category</span> -->
              <v-spacer></v-spacer>

              <v-btn
              title="Close" 
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
                lazy-validation
                autocomplete="off"
                @submit.prevent="submit"
              >
                <v-row class="categoryadd">
                  <v-col>
                    <v-row>
                      <v-col sm="10" md="10">
                        <v-text-field
                          outlined
                          type="text"
                          id="name"
                          :rules="nameRules"
                          v-model="data.category_name"
                          label="Category Name"
                          dense
                          @keyup="valid=true"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-card-actions class="justify-center">
                  <v-btn
                  color="#4fa5d6" 
                    @click="submit"
                    class="cmnbtnstyle"
                    :disabled="!valid"
                    id="btnshadow"
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
        <!-------------------------------View category---------------------------------------------->
        <div class="issuetable">
          <template v-if="!this.isFetching">
            <v-data-table
            :mobile-breakpoint="100"
              :headers="headers"
              :items="Category_data"
              class="elevation-1"
              :group-desc="true"
              :server-items-length="totalcategory"
                :items-per-page.sync="limit"
                :page.sync="currentPage"
            >
              

              <template v-slot:[`item.action`]="{ item }">
                    <v-row v-if="item.category_id>4">
                      <div style="display:flex">
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
                    <v-row> </v-row>
                  </template>
            </v-data-table>
            <br>
          </template>
        </div>
        <!------------------Edit--------------------------->
        <v-dialog v-model="editDialog" persistent max-width="600">
          <v-card v-if="editDialog">
            <div id="title">
              <v-card-title>
                <span class="text-h5">Edit Category</span>
                <v-spacer></v-spacer>

                <v-btn
                title="Close" 
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
                  @submit.prevent="editcategory"
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
                            v-model="categoryeditdata.category_name"
                            label="Category Name"
                            dense
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-card-actions class="justify-center">
                    <v-btn
                    color="#4fa5d6" 
                      @click="editcategory"
                      class="cmnbtnstyle"
                      :disabled="valid==false"
                      id="btnshadow"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!----------------Delete-------------------------------->
        <v-dialog v-model="confirmation" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h5"> </v-card-title>

        <v-card-text> Are you sure you want to delete '<span v-html="dltcategory.category_name"></span>'? </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red" text @click="onClose()"> No </v-btn>

          <v-btn  color="green darken-1" text @click="dlt()"> Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ------ Replace ----------- -->

    <v-dialog v-model="Re_confirmation" persistent max-width="30%">
      <v-card>
        <v-card-title class="text-h6"> Choose a category for replace </v-card-title>

        <v-card-text>
          <form
          ref="form" v-if="Re_confirmation" >
          <v-autocomplete
                        auto-select-first
                        background-color="white"
                        :items="categorylist"
                        v-model="dltcategory.category_name"
                        label="Category"
                        :rules="replacecategory"
                        v-on:change="valid=true"
                        outlined
                        dense
                        @keyup="keyCheck()"
                        style="margin-top: 10%;"
                      >
                      
                    </v-autocomplete>
                  </form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red" text @click="onClose()"> No </v-btn>

          <v-btn color="green darken-1" text @click="ReConfirmDelete()" :disabled="!valid"> Yes </v-btn>
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
  data() {
    return {
      valid:false,
      issuedata: [],
      editDialog: false,
      dialog: false,
      Cdata:[],
      dialogCompose :false,
      confirmation: false,
      Re_confirmation: false,
      currentPage: 1,
      prePage: 1,
      limit: 10,
      totalcategory:'',
      Category_data:[],
      categorydata: [],
      data: {
        category_name: "",
      },
      categoryeditdata: {
        category_id: "",
        category_name: "",
      },
      dltcategory:{
        category_id:"",
        category_name: "",
        TaskCount:""
      },
      headers: [
        {
          text: "ID",
          color: "red",
          value: "category_id",
          sortable: false,
          align: "start",
          width: "30%",
        },
        {
          text: " Category",
          sortable: false,
          value: "category",
          width: "50%",
        },
        {
          text: " Task Count",
          sortable: false,
          value: "TaskCount",
          width: "30%",
        },

        { text: "Action", value: "action", sortable: false, width: "30%" },
      ],
      category_list: [],
      nameRules: [
        (v) => !!v || "Category is required",
        (v) => !/^\s/.test(v) || "Enter a valid Category name",
       
        (v) => /^(?! )(?!\s)(?!.* {2} )[\s\S]*(?<!\s)(?! )$/.test(v)||
        "Enter a valid Issue type name ",
        (v) =>
          (v && v.length >= 3 && v.length <= 15) ||
          "Category must be between 3-15 characters",
      ],
      replacecategory:[(v) => !!v || "Category to replace is required",]
    };
  },
  methods: {
    async getCategory() {
      try{
        this.limits=this.limit
        if(this.limit==-1){
          this.limits=""
        }
      const params = { 
          limit: this.limits,
          page: this.currentPage,
        last_data:null
    };
   
        const response = await ApiService("/task/getcategory", "GET" ,null,null,params);

        if (response.length !== 0) {
          this.Category_data = response?.categoryTotalList;
          this.totalcategory = response.totalCount;

   
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getAllcategory() {
      try{
    

        const response = await ApiService("/task/getcategory", "GET" );

        if (response.length !== 0) {
          this.Cdata = response?.categoryTotalList;
          this.totalcategory = response.totalCount;


        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    async submit() {
      this.valid = false;
      if (this.$refs.form.validate()) {
        try {
    await ApiService(
            "/task/addCategory",
            "POST",
            this.data
          );
          this.prePage = this.currentPage;
          
          this.getCategory();
            this.valid = false;
            Vue.$toast.success("Category Added Successfully", {
              position: "top",
              duration: 1000,
              queue:true,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
            this.valid = false;
            this.dialog = false;
            this.$refs.form.reset();
          
        } catch (error) {
          console.log(error);
          const response=error.response.data
          if (response.statusCode == 1411) {
            this.valid = false;
            Vue.$toast.warning("Category is Required", {
              position: "top",
              duration: 500,
              queue:true,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
            this.dialog = true;
          } else if (response.statusCode == 1439) {
            this.valid = false;
            Vue.$toast.warning("Category already exists", {
              position: "top",
              duration: 1000,
              queue:true,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
          }
        }
      }
    },
    async editcategory() {
      this.valid = false;
      try {
        const udata = {
          category_name: this.categoryeditdata.category_name
        };
     
        await ApiService(
          "/task/editCategory/" + this.categoryeditdata.category_id,
          "PUT",
          udata,
          null,
          null
        );

     
          Vue.$toast.success("Category updated Successfully", {
            position: "top",
            duration: 1000,
            queue:true
          });
        
          this.getCategory();
          this.editDialog = false;
      } catch (error) {
        console.log(error, "error................");
        const response=error.response.data
        if (response.statusCode == 1439) {
          this.valid = false;
          Vue.$toast.warning("Category name must be unique", {
            position: "top",
            duration: 1000,
          });
          this.editDialog = true;
        }
      
        if (response.statusCode == 95) {
          this.valid = false;
          Vue.$toast.warning("Category name is required", {
            position: "top",
            duration: 1000,
          });

          this.editDialog = true;
        }
       
      }
    },
   
    editmodal(item) {
   
      this.editDialog = true;

      this.categoryeditdata.category_id = item.category_id;
      this.categoryeditdata.category_name = item.category;
    },
    close() {
      this.$refs.form.reset();
    },
    closeedit() {
      this.$refs.form.reset();
      this.editDialog = false;
  
    },
    openModal(item) {
      this.confirmation = true;
      this.dltcategory.category_id = item.category_id;
      this.dltcategory.category_name = item.category;
      this.dltcategory.TaskCount = item.TaskCount;
      this.getAllcategory() 
    },
    onClose() {
     
      this.confirmation = false;
      this.Re_confirmation = false;
      this.issue_type_id = null;
      this.getCategory();
    
    },
    async dlt() {
      this.confirmation = false;

      try {
        
        const data={
          replace_category:null
        }
        const URL = `/task/deleteCategory/${this.dltcategory.category_id}`;
          await ApiService(URL, "PUT",data);
          
          Vue.$toast.success("Category Deleted Successfully", {
            position: "top",
            queue:true,
          });
          this.getCategory();
        
      } catch (error) {
        console.log(error);
        const response=error.response.data
        if (response.statusCode==1589) {
          this.deleting_category = this.dltcategory.category_id;
          
   
          this.Re_confirmation = true;
          this.confirmation = false;
          this.category_list = this.categorylist
          
        }
      }
   
    },
    async ReConfirmDelete() {

      this.Re_confirmation = false;
      
      try {
        const data={
          replace_category:this.dltcategory.category_name
        }
        const URL = `/task/deleteCategory/${this.dltcategory.category_id}`;
       
      await ApiService(URL, "PUT", data);
       
          Vue.$toast.success("Category Deleted and Replaced Successfully", {
            position: "top",
            queue:true,
          });
          this.getCategory();
          this.$refs.form.reset();
      
      } catch (error) {
        console.log(error);
        const response = error.response.data;

        if(response.statusCode == 2535) {
          Vue.$toast.error("Category is required.", {
            position: "top",
          });
          this.$refs.form.reset();
        this.Re_confirmation = true;
        }else if(response.statusCode == 2523){
          Vue.$toast.warning("Replace category must be a category_id other than deleting category", {
            position: "top",
          });
          this.Re_confirmation = true;
        }
      }
    },
    
  },
  watch: {
    currentPage: {
      handler() {
        this.getCategory();
      },
      immediate: false,
    },
    limit: {
      handler() {
        this.changeValue = true;
        this.getCategory();
      },
      immediate: false,
    },
  },
  // mounted(){
  //   this.$refs.form.reset();

  // },
 
  
  computed:{
    categorylist() {
      return this.Cdata?.filter(
          (data) => data.category_id != this.dltcategory.category_id
      ).map(_item => { 
        return {
          "text": _item.category, 
          "value": _item.category_id
        }
    })
    }
  },

};
</script>
  
  
  
  
<style scoped>
#title {
  background-color: #4fa5d6;
  color: aliceblue;
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
  margin-left: 8%;
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

.addbtn {
  margin-left: 84%;
}

.issuetable {
 margin-top:2%;
  margin-left: 8%;
  max-width: 85%;
}
.categoryadd {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px !important;
  margin-left: 18px !important;
  margin-top: 2% !important;
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
  