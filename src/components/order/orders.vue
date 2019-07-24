<template>
    <el-card>
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>


      <!-- 搜索 -->
      <el-row style="margin-top:12px;">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="orderInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        border
        :data="orderTableData"
        style="width: 100%;margin-top:12px;">

        <el-table-column
          type="index">
        </el-table-column>

        <el-table-column
          prop="order_number"
          label="订单编号"
        width="220">
        </el-table-column>

        <el-table-column
          prop="order_price"
          label="订单价格">
        </el-table-column>

        <el-table-column
          prop="pay_status"
          label="是否付款"
          width="90">
          <template slot-scope="scope">
            <el-tag type="danger" size="mini" v-if="scope.row.pay_status === 0">未付款</el-tag>
            <el-tag type="success" size="mini" v-else>已付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="is_send"
          label="是否发货"
        width="80">
        </el-table-column>

        <el-table-column
          prop="create_time"
          label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
        width="200">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogVisible = true"></el-button>
            <el-button type="success" icon="el-icon-position" size="mini" @click="getLogisticsData()"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="orderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>


      <!-- 编辑对话框 -->
      <el-dialog
        @close="editDialogClosed"
        title="修改收货地址"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              :options="cityData">
            </el-cascader>

          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>


      <!-- 物流信息 -->
      <el-dialog
        title="物流信息"
        :visible.sync="logisticsDialogVisible"
        width="50%">
        <el-steps direction="vertical" :active="7">
          <el-step title="2019-07-12 16:08:22" description="购买商品成功"></el-step>
          <el-step title="2019-07-12 20:08:22" description="包裹正在等待揽件"></el-step>
          <el-step title="2019-07-13 09:08:22" description="以揽件"></el-step>
          <el-step title="2019-07-13 09:08:22" description="快件以到达【广东广州转运中心】 扫描员 是 【xxx】"></el-step>
          <el-step title="2019-07-13 20:08:22" description="由 【广东广州转运中心】 发往 【广州天河区百世分部】"></el-step>
          <el-step title="2019-07-13 21:08:22" description="派送中"></el-step>
          <el-step title="2019-07-14 18:08:22" description="已签收"></el-step>
        </el-steps>
        <span slot="footer" class="dialog-footer">
    <el-button @click="logisticsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="logisticsDialogVisible = false">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
</template>

<script>
  import cityData from '../../assets/city_data2017_element.js'
    export default {
      data(){
        return{
          orderInfo:{
            query:'',
            pagenum:1,
            pagesize:5
          },
          orderTableData:[], // 表格数据
          total:0, // 数据条数

          // 编辑
          editDialogVisible:false,
          editForm:{
            address1:'',
            address2:''
          },
          editFormRules:{
            address1:[
              {required:true,message:'请选择省市区',trigger:'blur'}
            ],
            address2:[
              {required:true,message:'请选择详细地址',trigger:'blur'}
            ],
          },

          // 省市区数据
          cityData:cityData,

          // 物流信息
          logisticsDialogVisible:false,
          logisticsData:[]
        }
      },
      created(){
        this.getOrderTableData();
      },
      methods:{
        // 物流数据
        async getLogisticsData(){
          const res = await this.axios.get('/kuaidi/619915933338');
          this.logisticsDialogVisible = true;
        },


        // 关闭编辑对话框
        editDialogClosed(){
          this.$refs.editFormRef.resetFields();
        },


        // 分页
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.orderInfo.pagesize = val;
          this.getOrderTableData();
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.orderInfo.pagenum = val;
          this.getOrderTableData();
        },

        // 获取order 列表数据
        async getOrderTableData(){
          const res = await this.axios.get(`orders`,{
            params:this.orderInfo
          });

          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            this.orderTableData = data.goods;
            this.total = data.total;
          }else {
            this.$message.error("获取订单数据失败");
          }
        }
      }
    }
</script>

<style scoped>

</style>
