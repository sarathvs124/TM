<template>
  <div>
    <div class="search-container">
      <form
        action="/search"
        method="get"
        @keyup.enter="searchIssue()"
        @submit.prevent="searchIssue()"
      >
        <input
          class="search expandright"
          id="searchright"
          type="search"
          placeholder="Search Issue"
          v-model="searchKey"
          label="Search Task"
          clearable
        />
        <label class="button searchbutton" for="searchright" title="Search Issue"
          ><span class="mglass">&#9906;</span></label
        >
      </form>
    </div>
  </div>
</template>
<script>
import ApiService from "../../service/apiservice";
export default {
  data() {
    return {
      searchKey: '' // declare searchKey property in data
    }
  },
   
    methods:{
        async searchIssue() {
      this.all = true;
      this.open = false;
      this.inprogress = false;
      this.resolved = false;
      this.closed = false;
      if (this.searchKey == "" || this.searchKey == null) {
        const params = {
          searchCol2: "project_id",
          searchKey2: this.$route.params.id,
          sortMethod: "desc",
          sortCol: "task_status",
        };

        const response = await ApiService(
          "/task/tasklist",
          "GET",
          null,
          null,
          params
        );

        
        localStorage.setItem("skey", this.serarchKey);
        this.task_list = { task: response?.data };
      } else {
        const params = {
          searchCol2: "project_id",
          searchKey2: this.$route.params.id,
          searchCol: "task_name",
          searchKey: this.searchKey,
          sortMethod: "desc",
          sortCol: "task_status",
        };


        const response = await ApiService(
          "task/tasklist",
          "GET",
          null,
          null,
          params
        );

        localStorage.setItem("skey", this.searchKey);
        this.$router.push("/task-list" );

        this.task_list = { task: response?.data };
      }
    },
    }
};
</script>
<style scoped>
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
.issuelabel1 {
  margin-top: 1.5%;
  margin-left: 1%;
  margin-bottom: 2.3%;
}
.button {
  display: inline-block;
  margin: 4px 2px;
  background-color: white;
  font-size: 14px;
  padding-left: 32px;
  padding-right: 32px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: black;
  text-decoration: none;
  cursor: pointer;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.button:hover {
  transition-duration: 0.4s;
  -moz-transition-duration: 0.4s;
  -webkit-transition-duration: 0.4s;
  -o-transition-duration: 0.4s;
  background-color: white;
  color: black;
}

.search-container {
  position: relative;
  display: inline-block;
  margin: 4px 2px;
  height: 50px;
  width: 50px;
  vertical-align: bottom;
  margin-right: 20px;
}

.page-title-wrapper {
  justify-content: space-between;
}
.searchbutton {
  position: absolute;
  font-size: 22px;
  width: 100%;
  margin: auto;
  padding: 0;
  top: 0;
  bottom: 0;
  margin-left: 0 !important;
}

.search:focus + .searchbutton {
  transition-duration: 0.4s;
  -moz-transition-duration: 0.4s;
  -webkit-transition-duration: 0.4s;
  -o-transition-duration: 0.4s;
  background-color: white;
  color: black;
}

.search {
  position: absolute;
  left: 49px;
  background-color: white;
  outline: none;
  border: none;
  padding: 0;
  width: 0;
  height: 100%;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 10;
  transition-duration: 0.4s;
  -moz-transition-duration: 0.4s;
  -webkit-transition-duration: 0.4s;
  -o-transition-duration: 0.4s;
}

.search:focus {
  width: 363px; 
  padding: 0 16px 0 0;
}

.expandright {
  left: auto;
  right: 60px;
  height: 100%;
}

.expandright:focus {
  padding: 0 0 0 16px;
}
</style>
