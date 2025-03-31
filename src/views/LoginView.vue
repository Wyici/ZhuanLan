<template>
    <div class="login-page mx-auto p-3 w-330">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules" v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="passwordVal"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">登录</button>
      </template>
    </validate-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ValidateInput from '../components/ValidateInput.vue';
import ValidateForm from '../components/ValidateForm.vue';
import { useStore } from 'vuex';
import { type RuleProp } from '../testData';
import createMessage from '../components/createMessage';
//import { useUserStore } from '../store/user';
const router = useRouter();
const store = useStore();
//const userStore = useUserStore();
// const onFormSubmit = async (result:boolean) => {
//   if(result){
//     try {
//       await userStore.login(emailVal.value,passwordVal.value)
//       await userStore.fetchCurrentUser()
//       createMessage('登录成功   2秒后跳转首页','success',2000)
//       setTimeout(() => {
//         router.push("/");
//       }, 2000);
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }
const onFormSubmit = (result:boolean) => {
  if(result){
    const payload = {
      email:emailVal.value,
      password:passwordVal.value
    }
    store.dispatch('loginAndFetch',payload).then(() => {
      createMessage('登录成功   2秒后跳转首页','success',2000)
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }).catch((e: any) => {
      console.log(e);
    })
  }
}
const passwordVal = ref('111111')
const emailVal = ref('111@test.com')
const passwordRules : RuleProp[] = [
  { type:'password',message:'密码长度不低于6位数'}
]
const emailRules: RuleProp[] = [
  {type:'required',message:'电子邮箱地址不能为空'},
  {type:'email',message:'请输入正确格式的电子邮箱地址'}
]
</script>

<style scoped>

</style>