<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import moment from 'moment'

const api = ref('https://192.168.233.40/todo/api/Todo/')
const isShowButton = ref(false)
const AllData = ref([])
const name = ref('')
const title = ref('')
const content = ref('')
const todoId = ref('')
const errorHandle = (error) => {
  const { response } = error
  const { status, data } = response
  const { returnData } = data
  let errorMsg = []
  switch (status) {
    case 400:
      for (const [key, value] of Object.entries(returnData)) {
        errorMsg.push(`${key}: ${value}`)
      }
      alert(errorMsg.join('\n'))
      break

    default:
      console.log('default', data)
      break
  }
}

//查詢全部
onMounted(async () => {
  const response = await axios.get(`${api.value}Get`)
  console.log(response.data)

  AllData.value = [...response.data.returnData]
})
async function callFind() {
  const response = await axios.get(`${api.value}Get`)
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
    const response = await axios.post(`${api.value}InsertTodo`, req)
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
    errorHandle(error)
  }
}
//刪除
async function doDelete(todoId) {
  try {
    const response = await axios.delete(`${api.value}Delete/${todoId}`)
    console.log(response)
    if (response.data.returnCode == 2000) {
      alert('刪除成功')
    } else if (response.data.returnCode == 4001) {
      alert(response.data.returnMessage)
    }

    await callFind()
  } catch (error) {
    console.error(error)
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
    const response = await axios.put(`${api.value}UpdateTodoStatus/${todoId}`, req)
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
    const response = await axios.put(`${api.value}UpdateTodoContent/${todoId.value}`, req)
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
    alert(error)
  }
}
</script>
<template>
  <div class="right">
    <div class="mb-3" style="width: 300px">
      <h1>請填寫代辦事項</h1>
      <label class="form-label">姓名</label>
      <input type="test" class="form-control" v-model="name" />
      <label for="exampleFormControlInput1" class="form-label">代辦標題</label>
      <input type="test" class="form-control" v-model="title" />
      <label class="form-label">代辦內容</label>
      <textarea class="form-control" rows="3" v-model="content"></textarea><br />
      <button type="button" class="btn btn-primary" @click="doCreate" v-show="!isShowButton">
        儲存
      </button>
      <button type="button" class="btn btn-primary" @click="doUpdateSave" v-show="isShowButton">
        編輯完成
      </button>
    </div>
  </div>
  <div class="left">
    <div v-for="data in AllData" :key="data.todoId" class="info-box">
      <p>
        <span v-if="data.isComplete == 'Y'">✅ </span><span v-else>❗ </span> {{ data.name }}/{{
          data.title
        }}<span style="float: right" v-if="data.isComplete == 'Y'">|已完成 </span
        ><span style="float: right" v-else>未完成 </span>
        <span style="float: right" v-if="data.completeTime">{{
          moment(data.completeTime).format('YYYY/MM/DD HH:mm:ss')
        }}</span>
      </p>
      <p>{{ data.todoContent }}</p>

      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          class="btn btn-primary me-md-2"
          type="button"
          style="text-align: end"
          @click="doUpdate(data)"
        >
          編輯
        </button>
        <button class="btn btn-primary" @click="doDelete(data.todoId)" type="button">刪除</button>
        <button
          class="btn btn-primary"
          type="button"
          v-if="data.isComplete != 'Y'"
          @click="isComplete(data.todoId)"
        >
          完成
        </button>

        <button v-else type="button" class="btn btn-secondary" disabled>完成</button>
      </div>
    </div>
  </div>
</template>
<style>
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.right {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.left {
  flex: 2;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.info-box {
  width: 720px;
  height: 180px;
  border-style: solid;
  padding: 5px;
  border-radius: 8px;
  border-color: #c0c0c0;
}
</style>
