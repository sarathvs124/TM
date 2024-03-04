<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),

  mounted() {
    let Script = document.createElement("script");
    Script.setAttribute(
      "src",
      "https://demo.dashboardpack.com/architectui-html-free/assets/scripts/main.js"
    );
    Script.async = true;

    document.head.appendChild(Script);
    
  },
};
</script>


<style>
:root {
  --sidebar-width: 220px;
}

body {
  background: var(--light);
  overflow: hidden;
  font-family: -apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol,noto color emoji !important;

}
.atwho-view {
  top:30px;
    position:relative !important;
    bottom: 0 !important;
    left: -0.8em;
    cursor: default;
    background-color: hsla(0,0%,100%,.94);
    min-width: 355px !important;
    max-width: 180px !important;
    max-height: 220px !important;
    overflow-y: auto;
    min-height: 175px !important;
}
.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline {
  min-height: 200px;
  max-height: 200px !important;
}
.fixed-header .app-header {
  z-index: 999;
}

.dropdown-content a {
  border-bottom: 1px solid #e0e0e0e0;
}
@media screen and (max-width: 1265px) {
  footer {
    left: 80px !important;
  }
}
@media screen and (max-width: 991px) {
  footer {
    left: 4px !important;
  }
}
p {
  word-wrap: break-word;
}
.col-lg-12 {
  word-break: break-all;
}
.v-application p {
  word-break: break-all;
}

.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  margin-left: 32%;
  min-height: 5%;
  height: 47px;
  margin-top: -25px;
  position: relative;
  overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.v-input__slot {
  background: #fff !important;
}

.topHeader .v-text-field__details {
  display: none;
}
.selectDropDown .v-input__slot {
  margin-bottom: 0;
  width: 72%;
}


.selectDropDown .v-select__slot input {
  margin-left: 13px;
}
.v-dialog {
  background-color: white !important;
  /* overflow-y:visible ; */
}
.frame {

  display: -webkit-inline-box;
  height: 100%;
  width: 100%;
}

.cmnbtnstyle{
 width:110px;
 height: 40px !important;
}
.v-messages__message{
  line-height: unset !important;
}
@media screen and (max-width: 1265px){
  footer{
    left: 0!important;
  }
}
.v-badge__badge {
    border-radius: 10px;
    color: #FFFFFF;
    display: inline-block;
    font-size: 12px;
    height: 20px;
    letter-spacing: 0;
    line-height: 1;
    min-width: 71px !important;
    padding: 4px 6px;
    pointer-events: auto;
    position: absolute;
    text-align: center;
    text-indent: 0;
    top: auto;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    white-space: nowrap;
}
#btnshadow{
  box-shadow: none;

}

#popover_4klg9gg8ik{
  background: blue!important;
  width: 100px!important;
  height: 30px!important;
}

.check .v-label{
  top: 3px!important;
}

.v-toolbar{
  background-color:  rgb(79, 165, 214) !important;
}
.app-header .app-header__content {
  display: flex;
  align-items: center;
  align-content: center;
  flex: 1;
  padding: 0 1.5rem;
  height: 60px;
  background-color: #f1f4f6;
}
.addButton {
  margin-top: 9px;
  background-color: rgb(16, 145, 219);
}
.app-header .app-header__content .header-menu .nav-link:hover {
  color: #000101;
}
.app-page-title .page-title-heading{
  font-size: 1.0rem!important;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
 
   
    background-color: #fcfade !important;
}
.dropdown-item:hover, .dropdown-item:focus {
    color: #16181b;
    text-decoration: none;
    background-color: #fcfade !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > th, .v-data-table > .v-data-table__wrapper > table > thead > tr > th, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    font-size: 0.93rem;
    color: #000101 !important;
    height: 48px;
}
.table thead th {
    vertical-align:middle !important;
}



@media screen and (max-width:770px){
  .input{
    padding: 3px;
    width: 95% !important;
    height: 90px !important;
    max-height: 155px;
    min-height: 42px;
    border: 1px solid black;
}
}

@media screen and (max-width: 600px){
  .topHeader{
    display: block;
  }
  #boxs{
    margin-left: 0!important;
  }
  .v-data-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 0.55rem !important;
    padding: 0 8px;
    margin-left: -13px !important;
}
}


.dropdown-menu.dropdown-menu-right.dropmenudiv2.show{
  margin-top: 65px;
  top: 120px !important;
}
.dropdown-menu.dropmenudiv.show{
  top: 140px  !important;
}

@media screen and (max-width:991.98px){
  .popover, .dropdown-menu{
    top: 15%!important;
  }
}
.dropdown-menu.dropdown-menu-left.dropDownList.show{
  top: 15%!important;
}
.dropdown-menu.dropdown-menu-right.show{
  top: 15%!important;
}


.input {
    width: 100%;
  }
  .mention-item {
    padding: 4px 10px;
    border-radius: 4px;
  }
  .mention-selected {
    background: #4fa5d6;
  }
  .highlight {
    padding: 0 2px; border-radius: 3px; 
    color: #4fa5d6;
  }
</style>
