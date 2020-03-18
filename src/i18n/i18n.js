import Vue from 'vue'
  import locale from 'element-ui/lib/locale';
  import VueI18n from 'vue-i18n'
  import messages from './langs'
  Vue.use(VueI18n)
  let languageKey=localStorage.getItem('language');

  if(languageKey!=null){
     if(languageKey=='en-US'){
         languageKey = 'en';
         
     }
     else{
        languageKey = 'cn';
     }
  }
  else{
    languageKey = 'en';
    localStorage.setItem('language','en-US');
  }
  // alert(languageKey)
  //从localStorage中拿到用户的语言选择，如果没有，那默认中文。
  const i18n = new VueI18n({
    locale: languageKey,
    messages,
  })
  locale.i18n((key, value) => i18n.t(key, value)) //为了实现element插件的多语言切换

  export default i18n

