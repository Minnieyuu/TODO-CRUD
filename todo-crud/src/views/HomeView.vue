<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
const isShowButton = ref(false)
const AllData = ref([])
const name = ref('')
const title = ref('')
const content = ref('')
const todoId = ref('')
//查詢全部
onMounted(async () => {
  const response = await axios.get('https://192.168.233.40/todo/api/Todo/Get')
  console.log(response.data)
  AllData.value = [...response.data.returnData]
})
async function callFind() {
  const response = await axios.get('https://192.168.233.40/todo/api/Todo/Get')
  AllData.value = [...response.data.returnData]
}
//新增
async function doCreate() {
  const req = {
    name: name.value,
    title: title.value,
    todoContent: content.value
  }

  try {
    const response = await axios.post('https://192.168.233.40/todo/api/Todo/InsertTodo', req)
    if (response.data.returnCode == 2000) {
      alert('新增成功')
      name.value = ''
      title.value = ''
      content.value = ''
      await callFind()
    } else {
      alert('新增失敗')
    }
  } catch (error) {
    console.log(error)
    alert('錯誤!請通知管理員')
  }
}
//刪除
async function doDelete(todoId) {
  try {
    const response = await axios.delete(`https://192.168.233.40/todo/api/Todo/Delete/${todoId}`)
    console.log(response)
    if (response.data.returnCode == 2000) {
      alert('刪除成功')
    } else if (response.data.returnCode == 4001) {
      alert(response.data.returnMessage)
    }

    await callFind()
  } catch (error) {
    console.log(error)
    alert('錯誤!請通知管理員')
  }
}
//編輯完成
async function isComplete(todoId) {
  const req = {
    todoId: todoId,
    isComplete: 'Y'
  }
  try {
    const response = await axios.put(
      `https://192.168.233.40/todo/api/Todo/UpdateTodoStatus/${todoId}`,
      req
    )
    if (response.data.returnCode == 2000) {
      alert(response.data.returnMessage)
      await callFind()
    } else {
      alert(response.data.returnMessage)
    }
  } catch (error) {
    console.log(error)
    alert('錯誤!請通知管理員')
  }
}

function doUpdate(data) {
  isShowButton.value = true
  name.value = data.name
  title.value = data.title
  content.value = data.todoContent
  todoId.value = data.todoId
}

async function doUpdateSave() {
  try {
    const req = {
      todoId: todoId.value,
      name: name.value,
      title: title.value,
      todoContent: content.value
    }
    const response = await axios.put(
      `https://192.168.233.40/todo/api/Todo/UpdateTodoContent/${todoId.value}`,
      req
    )
    if (response.data.returnMessage == '修改成功') {
      alert(response.data.returnMessage)
      name.value = ''
      title.value = ''
      content.value = ''
      todoId.value = ''
      isShowButton.value = false
      await callFind()
    } else {
      alert(response.data.returnMessage)
    }
  } catch (error) {
    console.log(error)
    alert('錯誤!請通知管理員')
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
    <button type="button" class="btn btn-primary" @click="doUpdateSave" v-show="isShowButton">
      編輯完成
    </button>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Title</th>
        <th scope="col">Content</th>
        <th scope="col">AddTime</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="data in AllData" :key="data.todoId">
        <td>{{ data.name }}</td>
        <td>{{ data.title }}</td>
        <td>{{ data.todoContent }}</td>

        <td>{{ data.addTime }}</td>
        <td><span v-show="data.isComplete == 'Y'">已完成</span></td>
        <button
          v-show="data.isComplete != 'Y'"
          type="button"
          class="btn btn-primary"
          @click="isComplete(data.todoId)"
        >
          完成
        </button>
        <button type="button" class="btn btn-primary" @click="doDelete(data.todoId)">刪除</button>
        <button type="button" class="btn btn-primary" @click="doUpdate(data)">編輯</button>
      </tr>
    </tbody>
  </table>
</template>
