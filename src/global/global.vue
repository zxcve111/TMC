<script>
import { getlanguage } from "@/api/getData";
import { setStore, setLocal, getLocal, removeLocal } from "../config/mUtils";
var message={};
  export default
  {
    message,
    async setLanguage () {
       const crs=await getlanguage({
        cultureCode:getLocal('language'),//en-US\zh-CN
      });
    this.message = crs;
    // alert("MESSAGE:"+JSON.stringify(this.message));
   },
   changeMessage(newLanguage){
      this.message = newLanguage;
   }
  }
</script>
