<template>
  <div class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
    <!-- top nav -->
    <topNavigation />

    <div class="app-main">
      <!-- side nav -->

      <div class="app-main__outer">
        <div class="app-main__inner">
          <div class="container rounded bg-white mt-12 mb-12 profilediv" >
            <div class="row">
              <div class="col-md-3  border-right" id="leftSide">
                <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                  <div v-if="profile_photo == null">
                    <img
                      width="150px"
                      height="150px"
                      class="rounded-circle mt-5"
                      src="../../assets/dd.jpg"
                      alt=""
                      title="Profile"
                    />
                  </div>

                  <div v-if="profile_photo !== null">
                    <img
                      class="rounded-circle mt-5"
                      width="150px"
                      height="150px"
                      alt=""
                      style="object-fit:cover;"
                      v-bind:src="profile_photo"
                    />
                  </div>

                  <br />
                 
                  <!-------------------- image upload -->

                  <span class="font-weight-bold">{{ data.user_name }}</span
                  ><span class="text-black-50">{{ data.email }}</span
                  ><span> </span>
                </div>
              </div>
              <div class="col-md-9 border-right">
                <div class="p-3 py-5">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-right">Profile Settings</h4>
                    <div class="p-3 py-5">
                      <div
                        class="d-flex justify-content-between align-items-center experience"
                      >
                        <v-row justify="center">
                          <v-dialog v-model="dialog" persistent max-width="800">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                style="color: blue"
                                @click="openModal()"
                                title="Edit"
                                v-bind="attrs"
                                v-on="on"
                              >
                                mdi-pencil
                              </v-icon></template
                            >
                            <v-card>
                              <v-toolbar flat color="#4FA5D6">
                                <v-toolbar-title style="color: white" data-test="profile"
                                  >Edit Profile</v-toolbar-title
                                >
                              </v-toolbar>
                              <v-card-title> </v-card-title>
                              <!--modal profile edit  -->
                              <v-card-text>
                                <v-container>
                                  <v-form
                                    ref="form"
                                    v-model="isSubmit"
                                    lazy-validation
                                    @submit.prevent="updatePic()"
                                    method="post"
                                    autocomplete="off"
                                  >
                                    <v-row>
                                     
                                      <br />

                                      <!-------------------- image upload -->

                                      <v-col cols="12" sm="12" md="12">
                                        <v-card id="cardStyle">
                                          <v-card-text>
                                            <div v-if="previewImage !== null">
                                              <div
                                                class="imagePreviewWrapper"
                                                :style="{
                                                  'background-image': `url(${previewImage})`,
                                                }"
                                              ></div>
                                            </div>
                                            <div v-if="previewImage == null">
                                              <img
                                                width="150px"
                                                height="150px"
                                                class="imagePreviewWrapper"
                                                src="../../assets/dd.jpg"
                                                alt=""

                                                title="Profile"
                                              />
                                            </div>
                                            <div class="d-flex center">
                                              <input
                                                class="filess"
                                                id="fileInput"
                                                ref="fileInput"
                                                type="file"
                                                @input="
                                                  pickFile();
                                                  buttonCheck();
                                                "
                                                @change="handleFileUploads()"
                                                accept="image/png,image/jpeg,image/jpg"
                                              />
                                            </div>
                                          </v-card-text>
                                        </v-card>
                                        <label class="labels" data-test="first name"
                                          >First Name <span id="imp">*</span></label
                                        >
                                        <v-text-field
                                          outlined
                                          type="text"
                                          :rules="nameRules"
                                          v-on:keyup="buttonCheck()"
                                          placeholder="First name"
                                          v-model="tempData.first_name"
                                          name="name"
                                        ></v-text-field>
                                        <label class="labels" data-test="middle name">Middle Name </label
                                        ><v-text-field
                                          type="text"
                                          outlined
                                          :rules="MiddlenameRules"
                                          v-on:keyup="buttonCheck()"
                                          value=""
                                          placeholder="Middle name"
                                          v-model="tempData.middle_name"
                                        ></v-text-field>

                                        <label class="labels" data-test="last name"
                                          >Last Name <span id="imp">*</span></label
                                        ><v-text-field
                                          type="text"
                                          outlined
                                          v-on:keyup="buttonCheck()"
                                          value=""
                                          :rules="LastnameRules"
                                          placeholder="Last name"
                                          v-model="tempData.last_name"
                                        ></v-text-field>

                                        <label class="labels" data-test="phone number"
                                          >Phone Number <span id="imp">*</span></label
                                        ><v-text-field
                                          outlined
                                          :spinners="true"
                                          type="Text"
                                          v-on:keyup="buttonCheck()"
                                          id="your-input-field"
                                          value=""
                                          :rules="numberRules"
                                          placeholder="Phone number"
                                          v-model="tempData.phone_no"
                                        ></v-text-field>

                                        <v-card-actions class="alignbtn">
                                          <v-spacer></v-spacer>

                                          <v-btn
                                            color="#4fa5h6"
                                            class="btn cmnbtnstyle"
                                            type="button"
                                            @click="close()"
                                            data-test="cancelBtn"
                                          >
                                            Cancel
                                          </v-btn>
                                          &nbsp;

                                          <v-btn
                                            color="#4fa5d6"
                                            class="btn cmnbtnstyle"
                                            type="button"
                                            :disabled="!isValid || !isSubmit"
                                            @click="updatePic()"
                                            id="btnshadow"
                                            data-test="saveBtn"
                                          >
                                            Save
                                          </v-btn>
                                        </v-card-actions>
                                      </v-col>
                                    </v-row>
                                  </v-form>
                                </v-container>
                              </v-card-text>
                            </v-card>
                          </v-dialog>
                        </v-row>
                      </div>
                      <br />
                    </div>
                  </div>

                  <!-------------------------------------------------- profile page----------------------------------------------------------------->

                  <div class="row mt-3">
                    <div class="col-md-6">
                      <label class="labels" data-test="firstName">First Name</label
                      ><input
                        disabled="disabled"
                        type="text"
                        id="color"
                        :title="data.first_name"
                        class="form-control"
                        placeholder="First name"
                        value=""
                        v-model="data.first_name"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="labels" data-test="secondName">Middle Name</label
                      ><input
                        id="color"
                        disabled="disabled"
                        :title="data.middle_name"
                        type="text"
                        class="form-control"
                        value=""
                        placeholder="Middle name"
                        v-model="data.middle_name"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="labels" data-test="lastName">Last Name</label
                      ><input
                        id="color"
                        disabled="disabled"
                        type="text"
                        class="form-control"
                        :title="data.last_name"
                        value=""
                        placeholder="Last name"
                        v-model="data.last_name"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="labels" data-test="phoneNumber">Phone Number</label
                      ><input
                        id="color"
                        disabled="disabled"
                        type="text"
                        :title="data.phone_number"
                        class="form-control"
                        value=""
                        placeholder="Phone number"
                        v-model="data.phone_number"
                      />
                    </div>

                    <div class="col-md-6">
                      <label class="labels">User Name</label
                      ><input
                        id="color"
                        disabled="disabled"
                        type="text"
                        :title="data.user_name"
                        class="form-control"
                        placeholder="User name"
                        value=""
                        v-model="data.user_name"
                      />
                    </div>

                    <div class="col-md-6">
                      <label class="labels">Email</label
                      ><input
                        id="color"
                        disabled="disabled"
                        type="text"
                        :title="data.email"
                        class="form-control"
                        placeholder="Email"
                        value=""
                        v-model="data.email"
                      />
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
</template>

<script>
import topNavigation from "./TopNav2.vue";
import ApiService from "../../service/apiservice";
import axios from "axios";

import { Env } from "../../environment.production";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";

export default {
  components: { topNavigation },
  data() {
    return {
      profileValue: false,
      previewImage: "",
      isSubmit: true,
     
      flag: "",
      isValid: false,
      msg: "",
      dialog: false,

      name: "",
      file: "",
      files: "",
      confirmation: false,

      newvalid: "",
      profile_photo: "",
      profile: {
        profileData: [],
      },

      tempData: {
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
      },
      nameRules: [
        (v) => !!v || "First Name is required",
        (v) => !/^\s/.test(v) || "Invalid Name",
        (v) => (v && v.length >= 3) || "First Name must greater than or equal 3",
        (v) => (v && v.length <= 30) || "First Name should between 3 to 30",
        (v) =>
          /^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! )$/.test(v) ||
          "First Name should between 3 to 30",
      ],
      MiddlenameRules: [
        (v) =>
          !v ||
          /^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! ){0,29}$/.test(v) ||
          "Middle Name should  between 0 to 30",
        (v) => !v || (v && v.length >= 0) || "Middle Name must greater than or equal 0",
        (v) => !v || (v && v.length <= 30) || "Middle Name should between 0 to 30",
        (v) => !v || !/^\s/.test(v) || "Invalid name",
      ],
      LastnameRules: [
        (v) => !!v || "Last Name is required",
        (v) => !/^\s/.test(v) || "Invalid Name",
        (v) => (v && v.length >= 1) || "Last Name must greater than or equal 1",
        (v) => (v && v.length <= 30) || "Last Name should between 1 to 30",
        (v) =>
          /^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! )$/.test(v) ||
          "Last Name should between 1 to 30",
      ],
      numberRules: [
        (v) => !!v || "Number is required",
        (v) => !/^\s/.test(v) || "Only digits are allowed",

        (v) => /^[0-9]{10}$/.test(v) || "Enter valid phone number",
      ],
      data: {
        user_name: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_no: "",
        email: "",
        image: "",
      },
    };
  },
  methods: {
    buttonCheck() {
      this.isValid = true;
    },
    async getUser() {
      const response = await ApiService("users/getProfile", "GET");

      this.data = response;
      if (this.data.middle_name === undefined) {
        this.tempData = {
          first_name: this.data.first_name,
          middle_name: "",
          last_name: this.data.last_name,
          phone_no: this.data.phone_number,
        };
      } else {
        this.tempData = {
          first_name: this.data.first_name,
          middle_name: this.data.middle_name,
          last_name: this.data.last_name,
          phone_no: this.data.phone_number,
        };
      }
      this.previewImage = response.profile_photo;
      this.profile_photo = response.profile_photo;
    },

    close() {
      
      this.$refs.fileInput.value = "";
      this.$refs.form.reset();
      this.dialog = false;
      this.getUser();
    },

    async updatePic() {
      this.newvalid = 0;

      this.isValid = false;
      try {
        const formData = new FormData();
        const URL = "/users/imageUpload";

        if (
          this.tempData.first_name &&
          this.tempData.last_name &&
          this.tempData.phone_no &&
          this.profileValue
        ) {
         
          formData.append("first_name", this.tempData.first_name);
          formData.append("middle_name", this.tempData.middle_name);
          formData.append("last_name", this.tempData.last_name);
          formData.append("phone_no", this.tempData.phone_no);
         
       
         
          formData.append("file", this.profile_photo);
        } else if (
          this.tempData.first_name &&
          this.tempData.last_name &&
          this.tempData.phone_no
        ) {
          

          formData.append("first_name", this.tempData.first_name);
          formData.append("middle_name", this.tempData.middle_name);
          formData.append("last_name", this.tempData.last_name);
          formData.append("phone_no", this.tempData.phone_no);
        } else if (
          !this.tempData.first_name &&
          !this.tempData.last_name &&
          !this.tempData.phone_no &&
          !this.tempData.middle_name &&
        
        this.profileValue) {
         
         
          formData.append("file", this.profile_photo);
        } else if (
          !this.tempData.first_name ||
          !this.tempData.last_name ||
          !this.tempData.phone_no
        ) {   
          
          
         this.$refs.form.validate();

         }

        await axios
          .create({
            baseURL: Env.baseUrl,
            headers: {
              "x-access-token": JSON.parse(localStorage.getItem("accessTocken")),
            },
          })
          .post(URL, formData, "POST")
          .then((response) => {
            this.data = response.data;
            Vue.$toast.success("Profile uploaded successfully", {
            position: "top",
            canTimeout: true,
            errorDuration: 500,
            preventDuplicates: 1,
            preventOpenDuplicates: 1,
            successDuration: 2000,

            closeOnClick: true,
            alertInfoDuration: 8000,
            duration: 500,
          });
          this.isValid = false;
          setTimeout(() => this.$router.go({ path: "/profile" }), 1000);

          setTimeout(() => window.location.reload(), 1000);
          }).catch(()=>{
            Vue.$toast.error("Cannot upload file", {
            position: "top",
            canTimeout: true,
            errorDuration: 500,
            preventDuplicates: 1,
            preventOpenDuplicates: 1,
            successDuration: 2000,

            closeOnClick: true,
            alertInfoDuration: 8000,
            duration: 500,
          });
          });
      

      
      } catch (error) {
        const response = error.response.data;
        if (response.statusCode == 711) {
          Vue.$toast.error("File size must be less than or equal to 10 mb", {
            position: "top",
          });
          this.isValid = false;
        } else if (response.statusCode == 710) {
          Vue.$toast.error("Invalid fileType only supports(jpeg,jpg,png)formats", {
            position: "top",
          });
          this.isValid = false;
        } else if (response.statusCode == 1350) {
          Vue.$toast.error("phone number already exist", {
            position: "top",
          });
          this.isValid = false;
        } else if (response.statusCode == 267) {
          Vue.$toast.error("first_name is not allowed to be empty", {
            position: "top",
          });
          this.isValid = false;
      
        }

        this.confirmation = false;
      }
    },
    editImageModal() {
      
      this.confirmation = true;
      this.getUser();
    },
    selectImage() {
      this.$refs.fileInput.click();
    },
    pickFile() {
      let input = this.$refs.fileInput;
       let file = input.files;
      if (file && file[0]) {
        let reader = new FileReader();
        
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file[0]);
        this.$emit("input", file[0]);
      }
    },

    
    handleFileUploads() {
      const file = this.$refs.fileInput.files[0];
     
      this.profile_photo = file;
      this.profileValue = true
      
      
      this.this.file = input.files;

      this.files = input.files[0];
      this.newvalid = 1;
    },
    onClose() {
      this.$router.go("/profile");
      this.confirmation = false;
    },
    openModal(){
      this.profileValue=false
    }
  },

  mounted() {
    this.getUser();
  },
};
</script>

<style scoped>
body {
  background: rgb(99, 39, 120);
}

.form-control:focus {
  box-shadow: none;
  border-color: #ba68c8;
}

.profile-button {
  background: rgb(99, 39, 120);
  box-shadow: none;
  border: none;
}
#your-input-field {
  appearance: none;
}

.profile-button:hover {
  background: #682773;
}

.profile-button:focus {
  background: #682773;
  box-shadow: none;
}

.profile-button:active {
  background: #682773;
  box-shadow: none;
}

.back:hover {
  color: #682773;
  cursor: pointer;
}

.labels {
  font-size: 100%;
}

.add-experience:hover {
  background: #417af7;
  color: #fff;
  cursor: pointer;
  border: solid 1px #2976fb;
}

#BoxCenter {
  margin-right: 25%;
}
.image-input {
  width: 150px;
  height: 150px;
  cursor: pointer;
  background-size: cover;
  background-position: center;
}
.imagePreviewWrapper {
  width: 261px;
  height: 252px;
  display: block;
  cursor: pointer;

  margin: 0 auto 30px;
  background-size: cover;
  background-position: center center;
}
.placeholder {
  border-radius: 50%;

  background: #f2f2f2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 18px;
  box-shadow: 2%;
}
.placeholder:hover {
  background: #e0e0e0;
}
.file-input {
  display: none;
}
#color {
  background-color: rgb(250, 254, 255);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
input::placeholder {
  color: #c2bcbc;
}
.alignbtn {
  justify-content: center;

}

.center {
  display: flex;
  justify-content: center;
}
.filess {
  width: 195px;
}
#imp {
  color: red;
}
#cardStyle{
  box-shadow: none;
  
}


@media screen and (max-height: 450px) {
  .imagePreviewWrapper {
  width: 1px;
  height: 252px;
  display: block;
  cursor: pointer;

  margin: 0 auto 0px;
  background-size: cover;
  background-position: center center;
}
}

@media screen and (max-width: 600px) {
  .openbtn {
    display: none !important;
  }
  #cardStyle{
  box-shadow: none;
  margin-left:-9%;
  
}

  
}
@media screen and (max-width: 820px) {
  .profilediv {
    max-width:100%
  }

  
}
@media screen and (max-width: 1000px) {
  .profilediv {
    max-width:100%
  }

  
}
@media screen and (max-width:880px){
  .text-black-50{
    white-space: nowrap; 
  width:140px; 
  overflow: hidden;
  text-overflow: ellipsis;
  }

}
</style>
