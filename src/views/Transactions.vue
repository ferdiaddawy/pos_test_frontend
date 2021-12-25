<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item>List</a-breadcrumb-item>
      <a-breadcrumb-item>App</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ background: '#fff', padding: '24px', minHeight: '400px' }">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="Transaksi">
          <a-form
            name="basic"
            layout="vertical"
            autocomplete="off"
            :model="{ layout: 'vertical' }"
          >
            <a-divider>Transaksi</a-divider>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="Kode Transaksi">
                  <a-input
                    v-model:value="formHeader.code"
                    disabled
                    placeholder="no transaksi akan di generate otomatis"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Customer">
                  <a-select
                    ref="select"
                    v-model:value="formHeader.customer"
                    @change="selectCustomer(formHeader.customer)"
                  >
                    <a-select-option
                      v-for="data of listCustomers"
                      :value="data.id"
                      :key="data.id"
                      >{{ data.name }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider>Detail Transaksi</a-divider>
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="Pilih Produk">
                  <a-select
                    ref="select"
                    v-model:value="formDetail.product"
                    @change="selectProduct(formDetail.product)"
                  >
                    <a-select-option
                      v-for="data of listProducts"
                      :value="data.id"
                      :key="data.id"
                      >{{ data.desc }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="Quantity">
                  <a-input
                    v-model:value="formDetail.qty"
                    @blur="setSubstotal()"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="Harga">
                  <a-input v-model:value="formDetail.price" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="Subtotal">
                  <a-input v-model:value="formDetail.subtotal" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="2">
                <a-button
                  style="margin-left: 10px; margin-top: 30px"
                  type="primary"
                  @click="saveTmpDetail()"
                  >Proses</a-button
                >
              </a-col>
              <a-col v-if="tmpFormDetail.length > 0" :span="24">
                <a-table :dataSource="tmpFormDetail" :columns="columns">
                  <template #bodyCell="{ column, index, record }">
                    <template v-if="column.key === 'product'">
                      {{ getProductName(record.product) }}
                    </template>
                    <template v-if="column.key === 'action'">
                      <a-button
                        type="danger"
                        style="margin-right: 5px"
                        @click="deleteTmpDetail(index)"
                        >Hapus</a-button
                      >
                    </template>
                  </template>
                </a-table>
              </a-col>
            </a-row>
            <a-divider>Pembayaran</a-divider>
            <a-row :gutter="16">
              <a-col :span="7">
                <a-form-item label="Sub Total">
                  <a-input v-model:value="formHeader.total_amount" readonly />
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item label="Diskon">
                  <a-input v-model:value="formHeader.total_discount" readonly />
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item label="Total">
                  <a-input v-model:value="formHeader.total_pay" readonly />
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-button
                  style="margin-left: 10px; margin-top: 30px"
                  type="primary"
                  @click="saveTransaction()"
                  >Proses</a-button
                >
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Histori Transkasi">
          <p>Content of Tab Pane 2</p>
          <p>Content of Tab Pane 2</p>
          <p>Content of Tab Pane 2</p>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, reactive, h } from "vue";
import { SmileOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { ParseError } from "./../utils.js";

const columns = [
  {
    title: "Nama Produk",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Qty",
    dataIndex: "qty",
    key: "qty",
  },
  {
    title: "Harga Satuan",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Subtotal",
    dataIndex: "subtotal",
    key: "subtotal",
  },
  {
    title: "Aksi",
    dataIndex: "action",
    key: "action",
  },
];

const activeKey = ref("1");
const formHeader = reactive({
  id: 0,
  code: "",
  customer: "",
  total_discount: "",
  total_amount: "",
  total_pay: "",
});
const formDetail = reactive({
  id: 0,
  product: "",
  qty: "",
  price: "",
  subtotal: "",
});
const listProducts = ref([]);
const listCustomers = ref([]);
const tmpFormDetail = ref([]);
const tmpCustomer = ref({});

const getProducts = async () => {
  try {
    const res = await axios.get("getProducts");
    listProducts.value = res.data;
  } catch (error) {}
};

const getCustomers = async () => {
  try {
    const res = await axios.get("getCustomers");
    listCustomers.value = res.data;
  } catch (error) {}
};

const selectProduct = (value) => {
  if (formHeader.customer == "") {
    notification.info({
      message: "Notifikasi Transaksi",
      description: "Silakan pilih customer dulu",
      duration: 10,
    });
    formDetail.product = "";
    return;
  }
  let data = listProducts.value.find((data) => data.id == value);
  formDetail.price = parseFloat(data.price);
};

const selectCustomer = (value) => {
  let data = listCustomers.value.find((data) => data.id == value);
  tmpCustomer.value = data;
};

const setSubstotal = () => {
  formDetail.subtotal = formDetail.qty * formDetail.price;
};

const saveTmpDetail = async () => {
  try {
    let cekData = tmpFormDetail.value.findIndex(
      (data) => data.product == formDetail.product
    );
    if (cekData < 0) {
      await axios.get("checkStockProduct", {
        params: {
          id: formDetail.product,
          qty: formDetail.qty,
        },
      });
      tmpFormDetail.value.push({ ...formDetail });
    } else {
      await axios.get("checkStockProduct", {
        params: {
          id: formDetail.product,
          qty:
            parseFloat(tmpFormDetail.value[cekData].qty) +
            parseFloat(formDetail.qty),
        },
      });
      tmpFormDetail.value[cekData].qty =
        parseFloat(tmpFormDetail.value[cekData].qty) +
        parseFloat(formDetail.qty);
      tmpFormDetail.value[cekData].subtotal =
        parseFloat(tmpFormDetail.value[cekData].qty) *
        parseFloat(formDetail.price);
    }
    getSubstoal();
    resetFormDetail();
  } catch (error) {
    notification.info({
      message: "Notifikasi Transaksi",
      description: ParseError(error),
      duration: 10,
    });
  }
};

const deleteTmpDetail = (value) => {
  tmpFormDetail.value.splice(value, 1);
};

const resetFormDetail = () => {
  formDetail.id = 0;
  formDetail.product = "";
  formDetail.qty = "";
  formDetail.price = "";
  formDetail.subtotal = "";
};

const getSubstoal = () => {
  let subtotal = 0;
  for (const iterator of tmpFormDetail.value) {
    subtotal = subtotal + parseFloat(iterator.subtotal);
  }

  formHeader.total_amount = subtotal;

  if (tmpCustomer.value.discount == "1") {
    if (tmpCustomer.value.discount_type == "F") {
      formHeader.total_discount = tmpCustomer.value.discount_value;
      formHeader.total_pay =
        formHeader.total_amount - formHeader.total_discount;
    } else {
      let diskon_persentase =
        (parseFloat(formHeader.total_amount) *
          parseFloat(tmpCustomer.value.discount_value)) /
        100;
      formHeader.total_discount = diskon_persentase;
      formHeader.total_pay =
        formHeader.total_amount - formHeader.total_discount;
    }
  } else {
    formHeader.total_pay = formHeader.total_amount;
  }
};

const saveTransaction = async () => {
  try {
    await axios.post("saveTransactions", {
      header: formHeader,
      detail: tmpFormDetail.value,
    });

    resetTransaction();

    notification.success({
      message: "Notifikasi Transaksi",
      description: "Transaksi anda berhasil dilakukan dengan Kode Transaksi",
      icon: h(SmileOutlined, { style: "color: #108ee9" }),
      duration: 10,
    });
  } catch (error) {}
};

const resetTransaction = () => {
  formHeader.id = 0;
  formHeader.code = "";
  formHeader.customer = "";
  formHeader.total_discount = "";
  formHeader.total_amount = "";
  formHeader.total_pay = "";
  tmpFormDetail.value = [];
};

const getProductName = (value) => {
  return listProducts.value.find((data) => data.id == value).desc;
};

getProducts();
getCustomers();
</script>
