<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item>List</a-breadcrumb-item>
      <a-breadcrumb-item>App</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ background: '#fff', padding: '24px', minHeight: '400px' }">
      <a-button
        type="primary"
        style="margin-bottom: 5px"
        @click="addCustomers()"
        >Tambah</a-button
      >
      <a-table :dataSource="listData" :columns="columns">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button
              type="danger"
              style="margin-right: 5px"
              @click="deleteCustomers(record)"
              >Hapus</a-button
            >
            <a-button type="warning" @click="editCustomers(record)"
              >Edit</a-button
            >
          </template>
        </template>
      </a-table>
    </div>

    <a-modal v-model:visible="visible" title="Basic Modal">
      <template #footer>
        <a-button key="back" @click="visible = false">Batal</a-button>
        <a-button key="submit" type="primary" @click="saveCustomers()"
          >Simpan</a-button
        >
      </template>
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
      >
        <a-form-item label="Nama Customer">
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item label="No Telp">
          <a-input v-model:value="formState.phone" />
        </a-form-item>

        <a-form-item label="Email">
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item label="Alamat">
          <a-input v-model:value="formState.address" />
        </a-form-item>

        <a-form-item label="Diskon">
          <a-select ref="select" v-model:value="formState.discount">
            <a-select-option value="0">NO</a-select-option>
            <a-select-option value="1">YES</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="formState.discount == '1'" label="Tipe Diskon">
          <a-select ref="select" v-model:value="formState.discount_type">
            <a-select-option value="F">FIX</a-select-option>
            <a-select-option value="P">PERSENTASE</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="formState.discount == '1'" label="Nilai Diskon">
          <a-input v-model:value="formState.discount_value" />
        </a-form-item>

        <a-form-item label="KTP">
          <input type="file" @change="onFileChange" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, reactive } from "vue";

const columns = [
  {
    title: "Nama Customer",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "No Telp",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Alamat",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Diskon",
    dataIndex: "discount",
    key: "discount",
  },
  {
    title: "Tipe Diskon",
    dataIndex: "discount_type",
    key: "discount_type",
  },
  {
    title: "Nilai Diskon",
    dataIndex: "discount_value",
    key: "discount_value",
  },
  {
    title: "KTP",
    dataIndex: "ktp",
    key: "ktp",
  },
  {
    title: "Aksi",
    dataIndex: "action",
    key: "action",
  },
];

const visible = ref(false);
const listData = ref([]);
const formState = reactive({
  id: 0,
  name: "",
  phone: "",
  email: "",
  address: "",
  discount: "0",
  discount_type: "F",
  discount_value: "",
  discount_value: "",
  ktp: [],
});

const addCustomers = () => {
  visible.value = true;
};

const onFileChange = (e) => {
  var files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  formState.ktp = files[0];
};

const saveCustomers = async () => {
  try {
    let formData = new FormData();
    for (const key in formState) {
      formData.append(key, formState[key]);
    }

    await axios.post("saveCustomers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await getCustomers();

    reset()

    visible.value = false;
  } catch (error) {}
};

const getCustomers = async () => {
  try {
    const res = await axios.get("getCustomers");
    listData.value = res.data;
  } catch (error) {}
};

const deleteCustomers = async (value) => {
  try {
    await axios.delete("deleteCustomers", {
      params: { id: value.id },
    });
    await getCustomers();
  } catch (error) {}
};

const editCustomers = (value) => {
  formState.id = value.id;
  formState.name = value.name;
  formState.phone = value.phone;
  formState.email = value.email;
  formState.address = value.address;
  formState.discount = value.discount;
  formState.discount_type = value.discount_type;
  formState.discount_value = value.discount_value;
  visible.value = true;
};

const reset = () => {
  formState.id = 0;
  formState.name = "";
  formState.phone = "";
  formState.email = "";
  formState.address = "";
  formState.discount = "";
  formState.discount_type = "";
  formState.discount_value = "";
};

getCustomers();
</script>

