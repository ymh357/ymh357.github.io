<template>
    <form class="form-horizontal" role="form" action="">
        <div class="form-group">
            <label for="name" class="control-label col-md-2">姓名</label>
            <div class=" col-md-4">
                <input v-model="name" class="form-control" id="name" type="text"/>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label col-md-2">年纪</label>
            <div class="col-md-4">
                <input v-model.number="age" type="number">
            </div>
        </div>
        <div class="form-group">
            <label class="control-label col-md-2">称呼</label>
            <div class="col-md-4">
                <div class="radio">
                    <label>
                        <input v-model="sex" name="sex" value="sir" type="radio" checked/> 先生
                    </label>
                </div>
                <div class="radio">
                    <label>
                        <input v-model="sex" name="sex" value="madam" type="radio"/> 女士
                    </label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="job" class="control-label col-md-2">工作</label>
            <div class="col-md-4">
                <select v-model="job" class="form-control" id="job">
                    <option value="creator" selected>开发者</option>
                    <option value="developer">运营</option>
                    <option value="manager">管理</option>
                    <option value="maintainer">维护</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label col-md-2">兴趣方向</label>
            <div class="col-md-4">
                <div class="checkbox">
                    <label>
                        <input v-model="interests" type="checkbox" value="front-end" checked/>前端
                    </label>
                </div>
                <div class="checkbox">
                    <label>
                        <input v-model="interests" type="checkbox" value="back-end"/>后端
                    </label>
                </div>
                <div class="checkbox">
                    <label>
                        <input v-model="interests" type="checkbox" value="ios"/>IOS
                    </label>
                </div>
                <div class="checkbox">
                    <label>
                        <input v-model="interests" type="checkbox" value="ui"/>UI
                    </label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label col-md-2" for="moreInfo" >更多资料</label>
            <div class="col-md-4">
                <textarea v-model.trim="moreInfo" class="form-control" id="moreInfo" rows="3" cols=""></textarea>
                <p>请不要超过500个字</p>
            </div>
        </div>
        <div class="text-center col-md-8">
            <button type="submit" class="btn btn-primary">提交</button>
        </div>
    </form>
</template>

<script>
    export default {
        data(){
            return{
                name: '',
                age: 20,
                sex: 'man',
                job: 'creator',
                interests: ['front-end'],
                moreInfo: ''
            }
        }
    }
</script>