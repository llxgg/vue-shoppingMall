<template>
    <div>
      <!--搜索输入框-->
      <el-row class="searchgroup">
        <el-col>
          <el-input clearable  placeholder="请输入内容" v-model="goodsInfo.query" @clear="getGoodsList" class="inputSearch">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>


      <!-- 表格 -->
      <el-table
        :data="goodListData"
        border
        style="width: 100%;margin-top:12px;">

        <el-table-column
         type="index">
        </el-table-column>

        <el-table-column
          prop="goods_name"
          label="商品名称">
        </el-table-column>

        <el-table-column
          prop="goods_price"
          width="110"
          label="商品价格(元)">
        </el-table-column>

        <el-table-column
          prop="goods_weight"
          width="90"
          label="商品重量">
        </el-table-column>

        <el-table-column
          width="130"
          label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | formatDate }}
          </template>

        </el-table-column>

        <el-table-column width="136" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGood"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[7, 14, 21, 28]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
</template>

<script>
    export default {
       data(){
         return {
           // 商品列表请求参数：
           goodsInfo:{
             query:'',
             pagenum:1,
             pagesize:7
           },
           goodListData:[], // 请求到的数据
           total:0
         }
       },
      created(){
         this.getGoodsList();
      },
      methods:{
         // 导航路由：
        goAddGoods(){
          this.$router.push({name:'add'})
        },


         //编辑商品
        editGood(){
          this.$message.warning("业务逻辑和其他业务大致相同，就不重复开发了")
        },
        // 删除商品：
        async removeGoods(row){
          const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);

          if(confirmResult == 'confirm'){
            const id = row.goods_id;
            const res = await this.axios.delete(`goods/${id}`);
            const {meta:{status,msg},data} = res.data;
            if(status === 200){
              this.$message.success("删除商品成功");
              // 更新数据
              this.getGoodsList();
            }else {
              this.$message.success("删除商品失败");
            }
          }else {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          }

        },

         // 分页：
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.goodsInfo.pagesize = val;
          this.getGoodsList();
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.goodsInfo.pagenum = val;
          this.getGoodsList();
        },


        // 请求商品列表的数据：
        async getGoodsList(){
          const res = await this.axios.get(`goods`,{
             params:this.goodsInfo
          });
          const {meta:{status,msg},data} = res.data;
          if(status === 200){
            this.goodListData = data.goods;
            this.total = data.total;
          }
        }
      }
    }
</script>

<style scoped>
  .box-card {
    height:100%;
  }
  .searchgroup {
    margin-top: 20px;
  }
  .inputSearch {
    width: 300px;
  }
</style>
