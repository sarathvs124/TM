<template>
  <div
    class="
      app-container app-theme-white
      body-tabs-shadow
      fixed-sidebar fixed-header
    "
  >
    <!-- top nav -->
    <topNavigation />

    <!-- side nav -->

    <div class="mainDiv">
      <div class="cardStyleDiv">
      <div class="cardStyle" style="margin-top: 10%; margin-bottom: 10%">
        <h2
          class="formTitle row justify-content-center"
          style="margin-bottom: 10%"
        >
          Change Password
        </h2>

        <v-form
          class="form"
          ref="form"
          v-model="valid"
          @submit.prevent="confirm"
        >
          <div class="rowsHere" >
         
              
           
            <div class="colsHere">
              <label class="label" for="name"
                >Old Password<span id="imp">*</span>
              </label>
              <div id="newpassword">
              <v-text-field
                outlined
                placeholder="Old Password"
                v-model="user.oldpassword"
                :type="show ? 'text' : 'password'"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show = !show"
                :rules="oldpasswordRules"
                v-on:keyup="ButoonCheck()"
              ></v-text-field>
            </div>
            </div>
            <div class="colsHere">
              <label class="label" for="name"
                >New Password<span id="imp">*</span>
              </label>
              <div id="newpassword">
              <v-text-field
              
                outlined
                placeholder="New Password"
                v-model="user.newpassword"
                :type="show1 ? 'text' : 'password'"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
                :rules="newpasswordRules"
            
                v-on:keyup="ButoonCheck()"
                @input="validateFields"
              
              ></v-text-field>
            </div>
            </div>
            <div class="colsHere">
              <label class="label" for="name"
                >Confirm Password<span id="imp">*</span>
              </label>
              <div id="newpassword">
              <v-text-field
             
                outlined
                placeholder="Confirm Password"
                v-model="user.confirmPassword"
                :type="show2 ? 'text' : 'password'"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show2 = !show2"
                :rules="confirmpasswordRules"
                v-on:keyup="ButoonCheck()"
                @change="Validate()"
                ></v-text-field>
             
            </div>
            </div>
          </div>

          <v-btn
            type="submit"
            id="submitButton"
            class="button"
            
                          color="#4fa5d6"
            style="margin-left: 40%"
            :disabled="!valid"
          >
            <span>save</span>
          </v-btn>
        </v-form>
      </div>
    </div>
    </div>
  </div>
</template>
    

<script>
import topNavigation from "./TopNav2.vue";
import ApiService from "../../service/apiservice.js";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
Vue.use(VueToast);

export default {
  components: { topNavigation },

  data() {
    return {
      valid: true,
      user: {
        oldpassword: "",
        newpassword: "",
        confirmPassword: "",
      },
      dialog: false,
      show: false,
      show1: false,
      show2: false,
      submitted: false,

      // oldpasswordRules: [
      //   (v) => !!v || "Password is required",
      //   (v) =>
      //   /^(?=.*[a-z])((?!.* )[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,25}$/.test(
      //       v
      //     ) ||
      //     "Please ensure that your password is between 8 and 25 characters long, and contains at least one uppercase letter, one lowercase letter, one digit, and one special character. ",
      // ],
      newpasswordRules: [
        (v) => !!v || " New password is required ",
        (v) =>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,25}$/.test(v) ||
          "Please ensure that your password is between 8 and 25 characters long, and contains at least one uppercase letter, one lowercase letter, one digit, and one special character. ",
 ],
      confirmpasswordRules: [
        (v) => !!v || " Confirm password is required",
        (v) => v == this.user.newpassword|| "Password does not match",
        
      ],
    };
  },
  methods: {
   
    validateFields() {
      this.valid = false;
      this.$refs.form.validate();
    },
    async confirm() {
      this.valid = false;
      if (this.$refs.form.validate()) {
        try {
          const data = {
            old_password: this.user.oldpassword,
            new_password: this.user.newpassword,
          };
          const response = await ApiService(
            "users/changePassword",
            "POST",
            data
          );

          console.log(response, "res");
          console.log(response.errorMessage, "error res");
    
            this.valid = false;
            Vue.$toast.success("password updated Successfully ", {
              position: "top",
              duration: 1000,
              preventOpenDuplicates: 0,
              preventDuplicates: 0,

              
            });
            this.$router.push("/");
            localStorage.clear();
          
      }catch (error) {
          
          const response=error.response.data
          if (response.statusCode == 20) {
            
            this.valid = false;
            Vue.$toast.warning("Old password is wrong", {
              position: "top",

              duration: 1000,
            });
          } else if (response.statusCode == 237) {
            this.valid = false;
            Vue.$toast.warning(
              "Old password  and new password can't be the same ",
              {
                position: "top",
                duration: 1000,
              }
            );
          } 
          
        }
        
      }
    
    },

    ButoonCheck() {
      this.valid = true;
    },
    
 
  },

 
  watch: {
    password: function () {
      this.ButoonCheck();

    },
  },
};
</script>

<style scoped>
.mainDiv {
 
  min-height: 100%;
  /* align-items: center; */
  justify-content: center;
  /* background-color: #f9f9f9; */
  /* font-family: "Open Sans", sans-serif; */
  /* font-family: -apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol,noto color emoji !important; */
}

.formTitle{
  font-size: 30px;
    line-height: 2.8rem;
    font-weight: 500;
    font-family: -apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol,noto color emoji !important;
}
.cardStyle {
  width: 700px;

  padding: 36px 0;

  margin: 30px 0;
}
.cardStyleDiv{
  display: flex;
  width: 100%;
  justify-content: center;
 
}
.colsHere{
  display: flex;
 
}
.rowsHere{
  display: flex;
  flex-direction: column;
  width: 100%;
}
#newpassword{
  width: 100%;
}
.colsHere label{
  width: 35%;
  padding-top: 15px;
}

.buttonWrapper {
  margin-top: 40px;
}
.button {
 
  margin-left: 26%;
  display: block;
  color: #fff;
  background-color: #065492;
  border-color: #065492;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.035);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  width:110px !important;
 height: 40px !important;
}
.submitButton:disabled,
button[disabled] {
  border: 1px solid #cccccc;
  background-color: #cccccc;
  color: #666666;
  width:110px;
 height: 40px !important;
}

.fram {
  margin-top: 20px;
}
@media screen and (max-width:770px){
  .cardStyleDiv{
    flex-direction: column;
    padding: 10px;
  }
  .colsHere label{
  width: 45%;
  padding-top: 15px;
}
  .colsHere{
    flex-direction: column;
  }
  .cardStyle{
    width: 100%!important;
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.modalbtn {
  border: none;
}
.form{
  display: flex;
  /* justify-content: center; */
  flex-wrap: wrap;
}


</style>