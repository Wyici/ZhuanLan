<template>
    <div class="signup-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册者也账户</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="formData.email"
          placeholder="请输入邮箱地址"
          type="text"
        />
        {{formData.email}}
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
          type="text"
          placeholder="请输入昵称"
          :rules="nickNameRules"
          v-model="formData.nickName"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="formData.password"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          type="password"
          placeholder="请再次输入密码"
          :rules="repeatedpasswordRules"
          v-model="formData.repeatedpassword"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">注册新用户</button>
      </template>
    </validate-form>
  </div>
</template>

<script setup lang="ts">
import { type RuleProp } from '../testData';
import { reactive } from 'vue';
import ValidateForm from '../components/ValidateForm.vue';
import ValidateInput from '../components/ValidateInput.vue';
import { useRouter } from 'vue-router';
import createMessage from '../components/createMessage';
import axios from 'axios';
const router = useRouter();
const formData = reactive({
    email:'',
    nickName:'',
    password:'',
    repeatedpassword:''
})
const passwordRules : RuleProp[] = [
    { type:'required',message:'密码不能为空'},
    { type:'password',message:'密码长度不低于6位数'}
]
const nickNameRules : RuleProp[] = [
    { type:'required',message:'昵称不能为空'}
]
const emailRules: RuleProp[] = [
    { type:'required', message:'电子邮箱地址不能为空'},
    { type:'email', message:'请输入正确格式的电子邮箱地址'}
]
const repeatedpasswordRules : RuleProp[] = [
    { type:'custom', message:'该密码与上次输入密码不同',validator:() => {
        return formData.password === formData.repeatedpassword;
    }},
    { type:'required',message:'密码不能为空'}
]

const onFormSubmit = (result:boolean) => {
  if(result){
    const payload = {
        email:formData.email,
        nickName:formData.nickName,
        password:formData.password
    }
    axios.post('/users',payload).then(() => {
      createMessage('注册成功   2秒后跳转登录页面','success',2000)
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }).catch(e => {
      console.log(e);
    })
  }
}
</script>

<style scoped>

</style>