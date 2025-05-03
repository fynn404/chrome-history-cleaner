// 当 DOM 内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面上的所有必要元素
    const timeRangeSelect = document.getElementById('timeRange');          // 时间范围选择下拉框
    const customRangeDiv = document.getElementById('customRange');         // 自定义时间范围的容器
    const startTimeInput = document.getElementById('startTime');           // 开始时间输入框
    const endTimeInput = document.getElementById('endTime');               // 结束时间输入框
    const domainFilterInput = document.getElementById('domainFilter');     // 域名过滤输入框
    const cleanHistoryButton = document.getElementById('cleanHistory');    // 清除历史按钮
    const statsTimeRangeSelect = document.getElementById('statsTimeRange'); // 统计时间范围选择
    const refreshStatsButton = document.getElementById('refreshStats');    // 刷新统计按钮
    const statsContainer = document.getElementById('statsContainer');      // 统计结果容器

    // 根据选择显示或隐藏自定义时间范围输入框
    timeRangeSelect.addEventListener('change', () => {
        customRangeDiv.style.display =
            timeRangeSelect.value === 'custom' ? 'block' : 'none';
    });

    // 清除历史记录的功能
    cleanHistoryButton.addEventListener('click', async () => {
        const timeRange = timeRangeSelect.value;
        const domainFilter = domainFilterInput.value.trim();

        let startTime;
        let endTime = new Date().getTime();  // 获取当前时间戳

        // 根据选择的时间范围计算开始时间
        switch (timeRange) {
            case 'hour':  // 最近一小时
                startTime = endTime - (60 * 60 * 1000);
                break;
            case 'day':   // 最近一天
                startTime = endTime - (24 * 60 * 60 * 1000);
                break;
            case 'week':  // 最近一周
                startTime = endTime - (7 * 24 * 60 * 60 * 1000);
                break;
            case 'month': // 最近一个月
                startTime = endTime - (30 * 24 * 60 * 60 * 1000);
                break;
            case 'custom': // 自定义时间范围
                startTime = new Date(startTimeInput.value).getTime();
                endTime = new Date(endTimeInput.value).getTime();
                break;
        }

        try {
            // 构建搜索查询参数
            const query = {
                startTime,
                endTime,
                text: domainFilter
            };

            // 搜索符合条件的历史记录
            const items = await chrome.history.search(query);

            if (domainFilter) {
                // 如果指定了域名过滤器，使用正则表达式匹配域名
                // 转义域名中的点号，确保正则匹配准确
                const urlPattern = new RegExp(`^https?://(.*\\.)?${domainFilter.replace(/\./g, '\\.')}`);
                for (const item of items) {
                    // 逐个删除匹配的 URL
                    if (urlPattern.test(item.url)) {
                        await chrome.history.deleteUrl({ url: item.url });
                    }
                }
            } else {
                // 如果没有指定域名，删除指定时间范围内的所有历史记录
                await chrome.history.deleteRange({ startTime, endTime });
            }

            alert('历史记录清除成功！');
        } catch (error) {
            console.error('清除历史记录时出错:', error);
            alert('清除历史记录失败，请重试。');
        }
    });

    // 刷新域名访问统计的功能
    async function refreshStats() {
        const timeRange = statsTimeRangeSelect.value;
        const endTime = new Date().getTime();
        let startTime;

        // 根据选择的时间范围计算开始时间
        switch (timeRange) {
            case 'day':   // 最近 24 小时
                startTime = endTime - (24 * 60 * 60 * 1000);
                break;
            case 'week':  // 最近一周
                startTime = endTime - (7 * 24 * 60 * 60 * 1000);
                break;
            case 'month': // 最近一个月
                startTime = endTime - (30 * 24 * 60 * 60 * 1000);
                break;
        }

        try {
            // 获取指定时间范围内的所有历史记录
            const items = await chrome.history.search({
                text: '',           // 空字符串表示匹配所有记录
                startTime,
                endTime,
                maxResults: 10000   // 最多获取 10000 条记录
            });

            // 统计每个域名的访问次数
            const domainStats = {};
            items.forEach(item => {
                try {
                    // 从 URL 中提取域名
                    const url = new URL(item.url);
                    const domain = url.hostname;
                    // 累加访问次数
                    domainStats[domain] = (domainStats[domain] || 0) + 1;
                } catch (e) {
                    console.error('无效的 URL:', item.url);
                }
            });

            // 将域名按访问次数降序排序
            const sortedDomains = Object.entries(domainStats)
                .sort(([, a], [, b]) => b - a);

            // 生成统计结果的 HTML 并显示
            statsContainer.innerHTML = sortedDomains
                .map(([domain, count]) => `
          <div class="stat-item">
            <span>${domain}</span>
            <span>${count} 次访问</span>
          </div>
        `).join('');

        } catch (error) {
            console.error('获取统计数据时出错:', error);
            statsContainer.innerHTML = '<p>加载统计数据失败</p>';
        }
    }

    // 添加事件监听器
    refreshStatsButton.addEventListener('click', refreshStats);    // 点击刷新按钮时更新统计
    statsTimeRangeSelect.addEventListener('change', refreshStats); // 改变时间范围时更新统计

    // 初始加载统计数据
    refreshStats();
}); 