# 获取当前时间，月份和年份分钟对，但是小时错
seed-input.vue
```
	useCurrentTime() {
	  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
	.....
```
toISOString() 返回的是 UTC 时间（格林威治标准时间）
中国是 UTC+8 时区，所以比 UTC 时间快8小时