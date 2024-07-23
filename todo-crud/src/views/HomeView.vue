<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { errorMessages } from 'vue/compiler-sfc'

const body = ref(null)

const name = ref('')
const title = ref('')
const content = ref('')
//查詢全部
onMounted(async () => {
  const response = await axios.get('https://192.168.233.40/todo/api/Todo/Get')
  console.log(response.data)
})

//新增
async function doCreate() {
  body.value = {
    name: name.value,
    title: title.value,
    todoContent: content.value
  }

  try {
    const response = await axios.post('https://192.168.233.40/todo/api/Todo/InsertTodo', body.value)
    if (response.data.returnCode == 2000) {
      alert('新增成功')
      name.value = ''
      title.value = ''
      content.value = ''
    } else {
      alert('新增失敗')
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <div class="mb-3" style="width: 300px">
    <h1>請填寫代辦事項</h1>
    <label class="form-label">姓名</label>
    <input type="test" class="form-control" v-model="name" />
    <label for="exampleFormControlInput1" class="form-label">代辦標題</label>
    <input type="test" class="form-control" v-model="title" />
    <label class="form-label">代辦內容</label>
    <textarea class="form-control" rows="3" v-model="content"></textarea><br />
    <button type="button" class="btn btn-primary" @click="doCreate">儲存</button>
  </div>
</template>
