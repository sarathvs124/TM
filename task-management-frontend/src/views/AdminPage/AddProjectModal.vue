<template>
  <v-dialog persistent v-model="dialogCompose" width="700">
    <template v-slot:activator="{ on, attrs }">
      <button v-bind="attrs" v-on="on" type="button" tabindex="0" class="dropdown-item" >
        Add Project
      </button>
    </template>
    <v-card class="overflow-visible" color="#FFFFFF">
      <v-toolbar flat color="#4FA5D6">
        <v-toolbar-title style="color: white" data-test="addProject">Add Project </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="closeDialog" dark>
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-toolbar>
      <br />
      <v-form ref="form" v-model="valid" autocomplete="off">
        <v-card-text>
          <v-row>
            <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
              <label class="label" for="name">Project Name<span id="imp">*</span> </label>
            </v-col>
            <v-col cols="12" lg="8" sm="8" md="8" xs="12">
              <v-text-field
                outlined
                placeholder="Project"
                color="black"
                v-on:keyup="checking()"
                :rules="nameRules"
                :error-messages="nameError"
                v-model="inputs.project_name"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
              <label class="label" for="name">Project Code<span id="imp">*</span> </label>
            </v-col>
            <v-col cols="12" lg="8" sm="8" md="8" xs="12">
              <v-text-field
          
                outlined
                v-on:keyup="checking()"
                placeholder="Project code"
                color="black"
                :rules="codeRules"
                :error-messages="codeError"
                v-model="inputs.project_code"
                required
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
              <label class="label" for="startdate"
                >Start Date<span id="imp">*</span>
              </label>
            </v-col>
            <v-col cols="12" lg="8" sm="8" md="8" xs="12">
              <v-menu v-model="menu2" min-width="auto" :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="inputs.start_date"
                    placeholder="Start Date"
                    icon="mdi-calendar"
                    readonly
                    outlined
                   
                    :rules="startdateRules"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="inputs.start_date"
                  v-on:change="checking()"
                  :min="new Date().toISOString().substr(0, 10)"
                  @input="(menu2 = false), (value = 2)"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
              <label class="label" for="name">End Date<span id="imp">*</span> </label>
            </v-col>
            <v-col cols="12" lg="8" sm="8" md="8" xs="12">
              <v-menu min-width="auto" v-model="menu1" :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="inputs.end_date"
                    placeholder="End Date"
                    icon="mdi-calendar"
                    readonly
                    outlined
                    :rules="enddateRules"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="inputs.end_date"
                  v-on:change="checking()"

                  :min="inputs.start_date"
                  
                  @input="menu1 = false"
                  :allowed-dates="allowedDates"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
              <label class="label" for="name">Description<span id="imp">*</span> </label>
            </v-col>

            <v-col cols="12" lg="8" sm="8" md="8" xs="12">
              <v-textarea
                color="black"
                outlined
                :rules="descriptionRules"
                v-on:keyup="checking()"
                :error-messages="descriptionError"
                v-model="inputs.project_description"
                required
              ></v-textarea>
            </v-col>
          </v-row>
          <v-card-actions class="justify-center">
            <v-btn
              color="#4FA5D6"
              style="color: black"
              :disabled="this.addForm"
              @click="add()"
              class="cmnbtnstyle" id="btnshadow" data-test="addBtn"
            >
             Save
            </v-btn>
          </v-card-actions>
        
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import ApiService from "../../service/apiservice";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
export default {
  datas: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
  }),
  data() {
    return {
      addForm: false,
      menu: false,
      menu1: false,
      isValid: false,
      valid: true,
      hasSaved: false,
      model: null,
      dialogCompose: false,
      inputs: {
        project_name: "",
        project_code: "",
        start_date: "",
        end_date: "",
        project_description: "",
      },
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => !/^\s/.test(v) || "Invalid Name",
        (v) => (v && v.length >= 3) || "Name must greater than or equal 3",
        (v) => (v && v.length <= 30) || "Name should between 3 to 30",
        (v) =>
        /^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! )$/.test(
            v
          ) || "Name should between 3 to 30",
      ],
      codeRules: [
        (v) => !!v || "Code is required",
        (v) => !/^\s/.test(v) || "Invalid code",
        (v) => (v && v.length >= 3) || "Code must greater than or equal 3",
        (v) => (v && v.length <= 15) || "Code should between 3 to 15",
        (v) =>
          /^(?! )(?!\s)(?!.* )[\s\S]*(?<!\s)(?! )$/.test(v) ||
          "Project code should be between 3 and 15 character length and spaces are not allowed",
      ],
      startdateRules: [(v) => !!v || "Date is required"],
      enddateRules: [(v) => !!v || "Date is required"],
      descriptionRules: [
        (v) => !!v || "Description is required",
        (v) => !/^\s/.test(v) || "Invalid description",
        // (v) =>/^[A-Za-z0-9!@#$&()`.+,"-{}=<>:;~]+([ _!@#$&()`.+,"-{}=<>:;]?[A-Z a-z0-9!@#$&()`.+,"-{}=<>:;]+)*$/.test(v) || "",
        (v) => (v && v.length >= 10) || "Description should be between 10 to 255",
        (v) => (v && v.length <= 255) || "Description should be between 10 to 255",
        (v) =>
        /^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! )$/.test(
            v
          ) || "Description should between 10 to 255",
      ],
    };
  },

  methods: {
    async add() {
      if (this.$refs.form.validate()) {
        this.addForm = true;
        this.dialog = true;
        this.$refs.form.validate();
        try {
          const response = await ApiService("/project", "POST", this.inputs);
          this.dialog = false;
           if (response.statusCode == 200) {
            Vue.$toast.success("Project Added ", {
              position: "top",
              queue:true,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
            this.$refs.form.reset();
            this.$router.go("/dashboard");
          }
        } catch (error) {
          const response = error.response.data;
          if(response.statusCode == 100){
            Vue.$toast.error("Project code already exists", {
              position: "top",
              queue:true,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
          }
          else if(response.statusCode == 75){
            Vue.$toast.error("end date must be greater than start date", {
              position: "top",
              queue:true,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
          }
          else if(response.statusCode == 1013){
            Vue.$toast.error("end date must be greater than or equal to current date", {
              position: "top",
              queue:true,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
          }
          else if(response.statusCode == 1012){
            Vue.$toast.error("start date must be greater than or equal to current date", {
              position: "top",
              queue:true,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,
            });
          }
        }
      }
    },
    checking() {
      this.addForm = false;
    },
   
    closeDialog() {
      this.$refs.form.reset();

      this.dialogCompose = false;
      // window.location.reload();
    },
  },
  // mounted() {
  //   this.$refs.form.reset();
  // },
};
</script>
<style>
#imp {
  color: red;
}
.text {
  margin-left: 12%;
}

.label {
  font-size: 126%;
}
</style>
