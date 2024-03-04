<template>
  <v-card elevation="4" max-width="600" height="400" class="email">
    <div class="row" style="margin-top: 30%">
      <div class="col-sm-12" style="margin-top: 10%">
        <div class="row justify-content-center">
          <h3 class="align-center" data-test="emailHeading1">
            Reset Your Password
          </h3>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <v-form v-model="isValid" autocomplete="off" lazy-validation ref="form">
          <v-container>
            <v-text-field
              label="Your email addess"
              autocomplete="off"
              prepend-inner-icon="mdi-email"
              max-width="600"
              v-model="datas.email"
              :rules="emailRules"
              outlined
              clearable
              name="email"
            ></v-text-field>
          </v-container>

          <template>
            <v-card-actions class="justify-center">
              <v-btn
              class="cmnbtnstyle"
                  color="#4fa5d6" 
                
                v-on:click="verify()"
                :loading="this.isSubmit"
                :disabled="this.isSubmit"

                data-test="btn1"
              >
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                  </span>
                </template>
                Send Email
              </v-btn>
            </v-card-actions> </template
          ><br />
          <p class="row justify-content-center">
            <a href="/"> Back to login?</a>
          </p>
        </v-form>
      </div>
    </div>
  </v-card>
</template>

<script>
import ApiService from "../../service/apiservice.js";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";

Vue.use(VueToast);
export default {
  data: () => ({
    isValid: true,

    isSubmit: false,
    datas: {
      email: "",
    },

    emailRules: [
      (v) => !!v || "Email is required",
      (v) =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "Email must be valid",
    ],
  }),
  methods: {
    async verify() {
      if (this.$refs.form.validate()) {
        console.log("dhjbdks");
        this.isSubmit = true;
        try {
          const response = await ApiService(
            "/login/forgotPassword/emailValidation",
            "POST",
            this.datas
          );
          if (response.statusCode == 200) {
            this.isSubmit = false;

            Vue.$toast.success("Email sent !", {
              position: "top",
            });
          }
        } catch (error) {
          const response = error.response.data;
          if (response.statusCode == 31) {
            Vue.$toast.warning("user not found", {
              position: "top",
              canTimeout: true,
              errorDuration: 8000,
              successDuration: 80,
              autoClose: 1000,
              closeOnClick: true,
              alertInfoDuration: 8000,
              duration: 500,
              toastId: 4,
            });
            this.$refs.form.reset();
          } else if (response.statusCode == 115) {
            Vue.$toast.error("Mail not sent!", {
              position: "top",
            });
            this.$refs.form.reset();
          }
          this.isSubmit = false;
        }
      }
    },
  },
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:300,400,700&display=swap);

body {
  background: #f5f5f5;
}

@media only screen and (max-width: 767px) {
  .hide-on-mobile {
    display: none;
  }
}

.login-box {
  background-size: cover;
  background-position: center;
  padding: 50px;
  margin: 50px auto;
  width: 50%;
  min-height: auto;
  -webkit-box-shadow: 0 2px 60px -5px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 60px -5px rgba(0, 0, 0, 0.1);
}
.email {
  margin-top: 8%;
  margin-left: auto;
  margin-right: auto;
}

.logo {
  font-family: "Source Sans Pro", "Arial", sans-serif;
  font-size: 25px;
  color: white;
}

.logo .logo-font {
  color: white;
}
.title {
  max-width: 100%;
  display: flex;
  justify-content: center;
}

@media only screen and (max-width: 767px) {
  .logo {
    font-size: 34px;
  }
}

.header-title {
  text-align: center;
  margin-bottom: 50px;
}
.reset {
  margin-left: 30%;
}
.login-form {
  max-width: 300px;
  margin: 0 auto;
}

.login-form .form-control {
  border-radius: 0;
  margin-bottom: 30px;
}

.login-form .form-group {
  position: relative;
}

.login-form .form-group .forgot-password {
  position: absolute;
  top: 6px;
  right: 15px;
}

.login-form .btn {
  border-radius: 0;
  -webkit-box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.login-form .btn.btn-primary {
  background: #3bc3ff;
  border-color: #31c0ff;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.forgot {

  color: #0a0a0a;
  margin-left: 35%;
}
/* CSS */
.button-18 {
  align-items: center;
  background-color: #0a66c2;
  border: 0;
  border-radius: 100px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-family: -apple-system, system-ui,"Segoe UI", Roboto, "Helvetica Neue",
    "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans",
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica,
    Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 20px;
  max-width: 480px;
  min-height: 40px;
  min-width: 0px;
  overflow: hidden;
  padding: 0px;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  touch-action: manipulation;
  transition: background-color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s,
    box-shadow 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s,
    color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
}

.button-18:hover,
.button-18:focus {
  background-color: #16437e;
  color: #ffffff;
}

.button-18:active {
  background: #09223b;
  color: rgb(255, 255, 255, 0.7);
}

.button-18:disabled {
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.3);
}
</style>
