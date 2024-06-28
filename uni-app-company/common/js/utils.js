class Utils{
	constructor(){
		// this.baseUrl = 'http://159.75.169.224:7300/pz'
		this.baseUrl = 'https://code.itndedu.com/pz'
	}
	
	//获取用户信息
	getUserInfo(){
		//调用登录的api
		uni.login({
			success:res=>{
				this.request({
					url:'/auth/wxLogin',
					data:{
						code:res.code
					},
					success:res=>{
						console.log(res,'res')
					}
				})
			}
		})
	}
	request(option={
		showLoading:false
	}){
		//判断url是否存在
		if(!option.url){
			return false
		} 
		if(option.showLoading){
			this.showLoading()
		}
		uni.request({
			url:this.baseUrl+option.url,
			data:option.data?option.data:{},
			header:option.header?option.header:{},
			method:option.method?option.method:'GET',
			success: (res) => {
				uni.hideLoading()
				//后端返回的数据是异常的
				if(res.data.code !== 10000){
					//将失败的结果返回出去
					if(option.fail && typeof option.fail == 'function'){
						option.fail(res)
					}
				}else{
					//成功
					if(option.success&& typeof option.success == 'function'){
						option.success(res.data)
					}
				}
			},
			fail:res=>{
				uni.hideLoading()
				console.log(res)
			}  
		})
	}
	//创建加载的Loading效果
	showLoading(){
		const isShowLoading=uni.getStorageSync('isShowLoading')
		if(isShowLoading){
			uni.hideLoading()
			uni.setStorageSync('isShowLoading',false)
		}
		uni.showLoading({
			title:'加载中...',
			complete:function(){
				uni.setStorageSync('isShowLoading',true)
			},
			fail:function(){
				uni.setStorageSync('isShowLoading',false)
			}
		})
	}
	
}

export default new Utils()