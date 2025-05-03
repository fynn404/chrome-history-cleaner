/**
 * Chrome 历史记录清理与统计工具的主要功能实现
 * 包含以下功能：
 * 1. 按时间范围清除历史记录
 * 2. 按域名清除历史记录
 * 3. 一键清除所有历史记录
 * 4. 查看域名访问统计
 */

// 当 DOM 内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // ====== 元素获取 ======
    // 时间范围相关元素
    const timeRangeSelect = document.getElementById('timeRange');          // 时间范围下拉选择框
    const customRangeDiv = document.getElementById('customRange');         // 自定义时间范围容器
    const startTimeInput = document.getElementById('startTime');           // 自定义开始时间输入框
    const endTimeInput = document.getElementById('endTime');               // 自定义结束时间输入框

    // 域名过滤和操作按钮
    const domainFilterInput = document.getElementById('domainFilter');     // 域名过滤输入框
    const cleanHistoryButton = document.getElementById('cleanHistory');    // 清除选定历史按钮
    const cleanAllHistoryButton = document.getElementById('cleanAllHistory'); // 清除所有历史按钮

    // 统计相关元素
    const statsTimeRangeSelect = document.getElementById('statsTimeRange'); // 统计时间范围选择
    const refreshStatsButton = document.getElementById('refreshStats');    // 刷新统计按钮
    const statsContainer = document.getElementById('statsContainer');      // 统计结果显示容器

    // ====== 时间范围选择处理 ======
    /**
     * 监听时间范围选择变化
     * 当选择"自定义范围"时显示自定义时间输入框，否则隐藏
     */
    timeRangeSelect.addEventListener('change', () => {
        customRangeDiv.style.display =
            timeRangeSelect.value === 'custom' ? 'block' : 'none';
    });

    // ====== 清除所有历史记录功能 ======
    /**
     * 处理清除所有历史记录的点击事件
     * 1. 显示确认对话框
     * 2. 使用 chrome.history.deleteAll() 清除所有记录
     * 3. 完成后刷新统计数据
     */
    cleanAllHistoryButton.addEventListener('click', async () => {
        // 显示确认对话框，防止误操作
        const confirmed = confirm('警告：这将清除您的所有浏览历史记录！\n此操作不可撤销。\n\n您确定要继续吗？');

        if (confirmed) {
            try {
                // 删除所有历史记录
                await chrome.history.deleteAll();

                // 刷新统计数据以反映更改
                await refreshStats();

                alert('所有历史记录已清除！');
            } catch (error) {
                console.error('清除所有历史记录时出错:', error);
                alert('清除历史记录失败，请重试。');
            }
        }
    });

    // ====== 清除选定历史记录功能 ======
    /**
     * 处理清除选定历史记录的点击事件
     * 支持：
     * 1. 按时间范围清除
     * 2. 按域名过滤清除
     * 3. 组合以上两个条件
     */
    cleanHistoryButton.addEventListener('click', async () => {
        const timeRange = timeRangeSelect.value;
        const domainFilter = domainFilterInput.value.trim();

        let startTime;
        let endTime = new Date().getTime();  // 当前时间戳

        // 计算开始时间
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
            // 构建历史记录搜索查询
            const query = {
                startTime,  // 开始时间
                endTime,    // 结束时间
                text: domainFilter  // 域名过滤文本
            };

            // 搜索符合条件的历史记录
            const items = await chrome.history.search(query);

            if (domainFilter) {
                // 如果指定了域名过滤器，使用正则表达式匹配域名
                // 使用正则表达式匹配域名，支持子域名
                // 例如：google.com 会匹配 www.google.com, mail.google.com 等
                const urlPattern = new RegExp(`^https?://(.*\\.)?${domainFilter.replace(/\./g, '\\.')}`);
                for (const item of items) {
                    // 逐个删除匹配的 URL
                    if (urlPattern.test(item.url)) {
                        await chrome.history.deleteUrl({ url: item.url });
                    }
                }
            } else {
                // 如果没有指定域名，直接删除时间范围内的所有记录
                await chrome.history.deleteRange({ startTime, endTime });
            }

            // 清除完成后刷新统计
            await refreshStats();

            alert('历史记录清除成功！');
        } catch (error) {
            console.error('清除历史记录时出错:', error);
            alert('清除历史记录失败，请重试。');
        }
    });

    // ====== 域名访问统计功能 ======
    /**
     * 刷新域名访问统计
     * 1. 获取指定时间范围内的历史记录
     * 2. 统计每个域名的访问次数
     * 3. 按访问次数降序排序
     * 4. 显示统计结果
     */
    async function refreshStats() {
        const timeRange = statsTimeRangeSelect.value;
        const endTime = new Date().getTime();
        let startTime;

        // 根据选择的时间范围计算统计起始时间
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
            // 查询历史记录
            const items = await chrome.history.search({
                text: '',           // 空字符串表示匹配所有记录
                startTime,          // 开始时间
                endTime,           // 结束时间
                maxResults: 10000   // 最多获取 10000 条记录
            });

            // 统计域名访问次数
            const domainStats = {};
            items.forEach(item => {
                try {
                    // 使用 URL API 解析域名
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
            // 如果没有记录，显示提示信息
            statsContainer.innerHTML = sortedDomains.length > 0 ?
                sortedDomains
                    .map(([domain, count]) => `
                        <div class="stat-item">
                            <span>${domain}</span>
                            <span>${count} 次访问</span>
                        </div>
                    `).join('') :
                '<p>没有找到历史记录</p>';

        } catch (error) {
            console.error('获取统计数据时出错:', error);
            statsContainer.innerHTML = '<p>加载统计数据失败</p>';
        }
    }

    // ====== 事件监听器和初始化 ======
    // 添加统计相关的事件监听器
    refreshStatsButton.addEventListener('click', refreshStats);    // 点击刷新按钮时更新统计
    statsTimeRangeSelect.addEventListener('change', refreshStats); // 改变时间范围时更新统计

    // 页面加载时初始化统计数据
    refreshStats();
}); 