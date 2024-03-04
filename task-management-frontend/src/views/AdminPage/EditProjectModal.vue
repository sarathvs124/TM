<template>
  <v-dialog persistent v-model="dialogCompose" width="700">
    <template v-slot:activator="{ on, attrs }">
      <a
        class="btn float-right"
        v-on:click="ProjectEditing(ProjectDate.project_id)"
        title="Project Edit"
      >
        <v-icon v-bind="attrs" v-on="on" style="color: blue">mdi-pencil</v-icon>
      </a>
    </template>

    <v-card class="overflow-visible" color="#FFFFFF">
      <v-toolbar flat color="rgb(44, 118, 188)">
        <v-toolbar-title style="color: aliceblue" 
          >Edit Project
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="closeDialog" dark>
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-toolbar>
      <br />
      <v-form
        ref="form"
        v-model="isSubmit"
        @submit.prevent="update()"
        method="post"
        autocomplete="off"
      >
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="4" md="2" sm="2" xs="12">
              <label class="label" for="name">Project Name<span id="imp">*</span> </label>
            </v-col>
            <v-col  cols="12" lg="8" sm="8" md="8" xs="12">
              <v-text-field
                outlined
                v-on:keyup="ButtonCheck()"
                placeholder="Project"
                color="black"
                :rules="nameRules"
                :error-messages="nameError"
                v-model="projectData.project_name"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" lg="4" md="2" sm="2" xs="12">
              <label class="label" for="startdate"
                >Start Date<span id="imp">*</span>
              </label>
            </v-col>
            <v-col cols="12" lg="8" sm="8" md="8" xs="12">
              <v-menu v-model="menu2" min-width="auto" :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="projectData.start_date"
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
                  v-model="projectData.start_date"
                  v-on:change="ButtonCheck()"
                  :min="new Date().toISOString().substr(0, 10)"
                  @input="(menu2 = false), (value = 2)"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="4" md="2" sm="2" xs="12">
              <label class="label" for="name">End Date<span id="imp">*</span> </label>
            </v-col>
            <v-col cols="12" lg="8" sm="8" md="8" xs="12">
              <v-menu min-width="auto" v-model="menu1" :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="projectData.end_date"
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
                  v-model="projectData.end_date"
                  v-on:change="ButtonCheck()"
                  :min="projectData.start_date"
                  @input="(menu1 = false), (value = 2)"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
              <label class="label" for="name">Description<span id="imp">*</span> </label>
            </v-col>
            <v-col  cols="12" lg="8" sm="8" md="8" xs="12">
              <v-textarea
                color="black"
                outlined
                v-on:keyup="ButtonCheck()"
                :rules="descriptionRules"
                :error-messages="descriptionError"
                v-model="projectData.project_description"
                required
              ></v-textarea>
            </v-col>
          </v-row>
          <v-card-actions class="justify-center">
            <v-btn class="cmnbtnstyle" color="#4fa5d6" :disabled="!addForm" type="submit" id="btnshadow">
              save
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
  props: {
    projectData: Object,

  },
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
      isSubmit: true,
      menu: false,
      menu1: false,
      isValid: false,
      valid: true,
      hasSaved: false,
      model: null,
      dialogCompose: false,

      projectData: {
        project_name: "",
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
          /^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! )$/.test(v) ||
          "Name should between 3 to 30",
      ],

      startdateRules: [(v) => !!v || "Date is required"],
      enddateRules: [(v) => !!v || "Date is required"],
      descriptionRules: [
        (v) => !!v || "Description is required",
        (v) => !/^\s/.test(v) || "Invalid description",
        (v) => (v && v.length >= 10) || "Description should be between 10 to 255",
        (v) => (v && v.length <= 255) || "Description should be between 10 to 255",
        (v) =>
          /^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! )$/.test(v) ||
          "Description should between 10 to 255",
      ],
    };
  },

  methods: {
    async getUser() {
      const id = this.projectId;
      const response = await ApiService("project/overallProjectStatus/" + id, "GET");
      this.projectData = response;
    },

    async update() {
      this.dialog = true;

      const id = this.projectId;
      this.inputs = {
        project_name: this.projectData.project_name,
        start_date: this.projectData.start_date,
        end_date: this.projectData.end_date,
        project_description: this.projectData.project_description,
      };
      try {
        const response = await ApiService("/project/" + id, "PUT", this.inputs);
        this.addForm = true;
        this.dialog = false;

        if (response.statusCode == 200) {
          Vue.$toast.success("Project updated successfully", {
            position: "top",
            duration: 300000,
            queue: true,
          });
          setTimeout(function () {
            window.location.reload();
          }, 1000);
        }
        
      } catch (error) {
        const response = error.response.data;
        this.addForm = false;
        if (response.statusCode == 1013) {
          Vue.$toast.warning("end date must be greater than or equal to current date", {
            position: "top",
          });
        }
        else if(response.statusCode == 1050){
           Vue.$toast.error("No change in data", {
          position: "top",
          duration: 1000,
        });
         setTimeout(function () {
            window.location.reload();
          }, 1000);
        }
        else if (response.statusCode == 1012) {
          Vue.$toast.warning("start date must be greater than or equal to current date", {
            position: "top",
          });
        } else if (response.statusCode == 75) {
          Vue.$toast.warning("end date must be greater than start date", {
            position: "top",
          });
        }
      }
    },

    profile() {
      this.profileCompose = true;
    },
    closeDialog() {
      this.addForm = false;
      this.$refs.form.reset();

      this.dialogCompose = false;
    },
    compose() {
      this.dialogCompose = false;
    },
    saveDraft() {
      this.dialogCompose = false;
    },
    save() {
      this.isEditing = !this.isEditing;
      this.hasSaved = true;
    },
    ButtonCheck() {
      this.addForm = true;
    },

    async ProjectStatus() {
      try {
        const id = this.projectId;

        const response = await ApiService("/project/overallProjectStatus/" + id, "GET");
        if (response.statusCode == 52) {
          this.$router.push("/dashboard");
        }
        this.projectStatus = response;

        this.inProgress =
          (this.projectStatus.inProgress * 100) / this.projectStatus.total_task;
        this.closed = Math.floor(
          this.projectStatus.total_task
            ? (this.projectStatus.closed * 100) / this.projectStatus.total_task
            : 0
        );
        this.openTask =
          (this.projectStatus.openTask * 100) / this.projectStatus.total_task;
        this.resolved =
          (this.projectStatus.resolved * 100) / this.projectStatus.total_task;
        this.projectRole = localStorage.getItem("projectRole");
      } catch (error) {
        const response = error.response.data;
        if (response.statusCode == 50 || response.statusCode == 399) {
          this.$router.push("/dashboard");
        }
      }
    },
    refreshEdit() {
      this.ProjectStatus();
    },
  },
  mounted() {
    this.getUser()
    this.projectId = this.$store.state.projectId;
  },
};
</script>
<style>
#imp {
  color: red;
}
.theme--light.v-icon:focus::after {
  opacity: 0 !important;
}
</style>
