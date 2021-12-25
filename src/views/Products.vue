<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item>List</a-breadcrumb-item>
      <a-breadcrumb-item>App</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ background: '#fff', padding: '24px', minHeight: '400px' }">
      <a-button type="primary" style="margin-bottom: 5px" @click="addProducts()"
        >Tambah</a-button
      >
      <a-table :dataSource="listData" :columns="columns">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button
              type="danger"
              style="margin-right: 5px"
              @click="deleteProducts(record)"
              >Hapus</a-button
            >
            <a-button type="warning" @click="editProducts(record)"
              >Edit</a-button
            >
          </template>
        </template>
      </a-table>
    </div>

    <a-modal v-model:visible="visible" title="Basic Modal">
      <template #footer>
        <a-button key="back" @click="visible = false">Batal</a-button>
        <a-button key="submit" type="primary" @click="saveProducts()"
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
        <a-form-item label="Nama Produk" name="nama_produk">
          <a-input v-model:value="formState.desc" />
        </a-form-item>

        <a-form-item label="Satuan" name="satuan">
          <a-select ref="select" v-model:value="formState.um">
            <a-select-option value="KG">KG</a-select-option>
            <a-select-option value="PCS">PCS</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Stok" name="stok">
          <a-input v-model:value="formState.stock" />
        </a-form-item>

        <a-form-item label="Harga" name="harga">
          <a-input v-model:value="formState.price" />
        </a-form-item>

        <a-form-item label="Gambar Produk" name="gambar_produk">
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
    title: "Nama Produk",
    dataIndex: "desc",
    key: "desc",
  },
  {
    title: "Satuan",
    dataIndex: "um",
    key: "um",
  },
  {
    title: "Stok",
    dataIndex: "stock",
    key: "stock",
  },
  {
    title: "Harga Satuan",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Gambar",
    dataIndex: "image",
    key: "image",
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
  desc: "",
  um: "",
  stock: 0,
  price: 0,
  image: [],
});

const addProducts = () => {
  visible.value = true;
};

const onFileChange = (e) => {
  var files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  formState.image = files[0];
};

const saveProducts = async () => {
  try {
    let formData = new FormData();
    for (const key in formState) {
      formData.append(key, formState[key]);
    }

    await axios.post("saveProducts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await getProducts();
    reset()

    visible.value = false;
  } catch (error) {}
};

const getProducts = async () => {
  try {
    const res = await axios.get("getProducts");
    listData.value = res.data;
  } catch (error) {}
};

const deleteProducts = async (value) => {
  try {
    await axios.delete("deleteProducts", {
      params: { id: value.id },
    });
    await getProducts();
  } catch (error) {}
};

const editProducts = (value) => {
  formState.id = value.id;
  formState.desc = value.desc;
  formState.um = value.um;
  formState.stock = value.stock;
  formState.price = value.price;
  visible.value = true;
};

const reset = () => {
  formState.id = 0;
  formState.desc = "";
  formState.um = "";
  formState.stock = 0;
  formState.price = "";
};

getProducts();
</script>

