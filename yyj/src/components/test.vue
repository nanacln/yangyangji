<template>
  <div>
    {{age}}
  </div>
</template>
<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import {aa,stuInfo,eri} from '@/types/type'

console.log(44444);
let age=ref(18)
let obj:aa={
  name:'sdf'
  
}
let stu:stuInfo={
  name:'sss',
  age:10,
  grade:'di'
}
let asdf:eri={
  dd:'sdf',
  sd:1
}
console.log(obj,stu,asdf);

</script>