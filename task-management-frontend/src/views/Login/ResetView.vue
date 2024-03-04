<template>
  <div class="ResetFormDiv">
    <v-card elevation="4" class="reset">
      <div class="title">
        <div class="row justify-content-center">
          <h3 class="color" data-test="Heading1">Reset Password</h3>
        </div>
      </div>

      <div>
        <br />

        <v-form v-model="isValid" autocomplete="off" ref="form">
          <v-container class="txtcontainer">
            <v-text-field
              v-model="data.newPassword"
              label="New Password"
              name="New Password"
              prepend-inner-icon="mdi-lock"
              :rules="passwordRules"
              outlined
              :append-icon="passwordShow1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="passwordShow1 = !passwordShow1"
              :type="passwordShow1 ? 'text' : 'password'"
              @input="validateFields"
            />

            <v-text-field
              v-model="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              prepend-inner-icon="mdi-lock"
              :rules="confirmPasswordRules"
              outlined
              :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="passwordShow = !passwordShow"
              :type="passwordShow ? 'text' : 'password'"
              v-on:keyup="ResetButtonCheck()"
              @change="Validate()"
            />
          </v-container>

          <template>
            <v-card-actions class="justify-center">
              <v-btn
                class="cmnbtnstyle"
                color="#4fa5d6"
                :disabled="!isValid"
                @click="reset"
                id="btnshadow"
                data-test="btn1"
              >
                Save
              </v-btn>
            </v-card-actions>
          </template>
        </v-form>
      </div>
    </v-card>
  </div>
</template>

<script>
import ApiService from "../../service/apiservice.js";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
Vue.use(VueToast);

export default {
  data() {
    return {
      isValid: false,
      data: {
        newPassword: "",
      },
      confirmPassword: "",
      passwordRules: [
        (v) => !!v || "Password is required",

        (v) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,25}$/.test(
            v
          ) ||
          "Please ensure that your password is between 8 and 25 characters long, and contains at least one uppercase letter, one lowercase letter, one digit, and one special character. ",
      ],
      confirmPasswordRules: [
        (value) => !!value || "type confirm password",
        (value) =>
          value == this.data.newPassword ||
          "The password confirmation does not match.",
      ],

      passwordShow: false,
      passwordShow1: false,
    };
  },

  methods: {
    async reset() {
      if (this.$refs.form.validate()) {
        try {
          let token = this.$route.params.url;

          const response = await ApiService(
            "login/forgotPassword/setNewPassword/" + token,
            "PUT",
            this.data
          );
          if (response.statusCode == 200) {
            Vue.$toast.success("Successfully reset password", {
              position: "top",
            });
            this.$router.push("/");
          }
        } catch (error) {
          const response = error.response.data;
          if (response.statusCode == 23) {
            Vue.$toast.error("Token has expired", {
              position: "top",
            });
          } else if (response.statusCode == 25) {
            Vue.$toast.warning("Wrong Token", {
              position: "top",
            });
          } else if (response.statusCode == 27) {
            Vue.$toast.warning("Invalid token", {
              position: "top",
            });
          } else if (response.statusCode == 31) {
            Vue.$toast.warning("Password is not allowed to be empty", {
              position: "top",
            });
          } else if (response.statusCode == 32) {
            Vue.$toast.warning("New password must be a string", {
              position: "top",
            });
          }
        }
      }
    },
    ResetButtonCheck() {
      this.valid = true;
    },
    validateFields() {
      this.isValid = false;
      this.$refs.form.validate();
    },
  },
  watch: {
    password: function () {
      this.ResetButtonCheck();
    },
  },
  mounted() {
    localStorage.clear();
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.newPassword === this.confirmPassword || "Password must match";
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

.logo {
  font-family: "Source Sans Pro", "Arial", sans-serif;
  font-size: 25px;
  align-items: center;
  color: white;
}
.login {
  margin-left: 30%;
}

.logo .logo-font {
  color: white;
}
.title {
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.reset {
  max-width: 500px;
  max-height: 370px;

  display: flex;
  width: 100%;
  justify-content: center;
  padding: 39px;
  flex-direction: column;
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
.color {
  color: #4fa5d6;
}
h3 {
  margin-top: 7%;
  font-size: 30px;
  font-weight: 600;

  background-image: repeating-radial-gradient(
    circle closest-corner at 100px 100px,
    #553c9a,
    #0a99ff 0%,
    #5419f6 30%
  );
  color: transparent;
  background-clip: text;

  -webkit-background-clip: text;
}
.txtcontainer {
  width: 100%;
}

@media screen and (max-width: 1000px) {
  .ResetFormDiv{
    padding: 15px!important;
  }
}
.ResetFormDiv {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 50px;
  height: 100%;
  align-items: center;
}
@media screen and (max-width: 280px) {
  .ResetFormDiv{
    padding: 0px!important;
  }
}

</style>
