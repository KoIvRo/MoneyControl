import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FooterNav from '../components/FooterNav';
import ChartComponent from '../components/ChartComponent';

const AnalyticsPage = () => {
  const { transactions } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const isMobile = window.innerWidth < 768;

  const filterTransactionsByPeriod = () => {
    return transactions.filter(transaction => {
      const date = new Date(transaction.date);
      
      if (timeRange === 'month') {
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      } else if (timeRange === 'year') {
        return date.getFullYear() === selectedYear;
      } else if (timeRange === 'all') {
        return true;
      }
      return false;
    });
  };

  const filteredTransactions = filterTransactionsByPeriod();

  const getExpenseData = () => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    
    const categoryMap = {};
    expenseTransactions.forEach(transaction => {
      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = 0;
      }
      categoryMap[transaction.category] += transaction.amount;
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getIncomeData = () => {
    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
    
    const categoryMap = {};
    incomeTransactions.forEach(transaction => {
      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = 0;
      }
      categoryMap[transaction.category] += transaction.amount;
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getTrendData = () => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.getMonth();
      
      if (transaction.type === 'income') {
        monthlyIncome[month] += transaction.amount;
      } else {
        monthlyExpense[month] += transaction.amount;
      }
    });
    
    return {
      months,
      income: monthlyIncome,
      expense: monthlyExpense
    };
  };

  const expenseChartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ₽ ({d}%)'
    },
    legend: {
      orient: isMobile ? 'horizontal' : 'vertical',
      bottom: isMobile ? 0 : 'center',
      right: isMobile ? 'center' : 0,
      left: isMobile ? 'center' : 'auto',
      data: getExpenseData().map(item => item.name)
    },
    series: [{
      name: 'Расходы',
      type: 'pie',
      radius: ['40%', '70%'],
      center: isMobile ? ['50%', '40%'] : ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: isMobile ? '14' : '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: getExpenseData()
    }]
  };

  const incomeChartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ₽ ({d}%)'
    },
    legend: {
      orient: isMobile ? 'horizontal' : 'vertical',
      bottom: isMobile ? 0 : 'center',
      right: isMobile ? 'center' : 0,
      left: isMobile ? 'center' : 'auto',
      data: getIncomeData().map(item => item.name)
    },
    series: [{
      name: 'Доходы',
      type: 'pie',
      radius: ['40%', '70%'],
      center: isMobile ? ['50%', '40%'] : ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: isMobile ? '14' : '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: getIncomeData()
    }]
  };

  const trendChartOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach(param => {
          result += `${param.seriesName}: ${param.value.toLocaleString()} ₽<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Доходы', 'Расходы'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: getTrendData().months
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} ₽'
      }
    },
    series: [
      {
        name: 'Доходы',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 4,
          color: '#34a853'
        },
        itemStyle: {
          color: '#34a853'
        },
        symbolSize: 8,
        data: getTrendData().income
      },
      {
        name: 'Расходы',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 4,
          color: '#ea4335'
        },
        itemStyle: {
          color: '#ea4335'
        },
        symbolSize: 8,
        data: getTrendData().expense
      }
    ]
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      years.push(year);
    }
    return years;
  };

  const renderMobileView = () => (
    <div className="page-container analytics-page">
      <div className="header">
        <div className="header-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.77.85-1.26 1.85-1.26.87 0 1.54.39 1.79 1.1.12.32.45.53.79.53h.97c.5 0 .84-.52.62-.96-.47-.95-1.43-1.7-2.92-1.97V7.5c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5v1.1c-1.7.39-2.9 1.84-2.9 3.4 0 2.2 1.8 3.07 3.9 3.59 1.97.48 2.34 1.22 2.34 1.89 0 .61-.41 1.38-1.85 1.38-1.46 0-2.09-.65-2.32-1.32-.11-.32-.43-.53-.77-.53h-.95c-.5 0-.84.52-.62.97.57 1.29 1.78 1.92 3.58 2.13v1.27c0 .28.22.5.5.5h1c.28 0 .5-.22.5-.5v-1.27c1.97-.35 3.25-1.84 3.25-3.58-.01-2.08-1.65-2.94-3.89-3.48z"></path>
            </svg>
          </div>
          <div className="logo-text">MoneyControl</div>
        </div>
        
        <div className="user-info">
          <div className="user-greeting">
            <h1>Финансовая аналитика</h1>
            <p>Анализ ваших доходов и расходов</p>
          </div>
        </div>
      </div>
      
      <div className="content">
        <div className="section">
          <div className="section-title">
            <h2>Период анализа</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {['month', 'year', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '10px 20px',
                  border: `1px solid ${timeRange === range ? 'var(--primary)' : 'var(--border)'}`,
                  background: timeRange === range ? 'var(--primary)' : 'white',
                  color: timeRange === range ? 'white' : 'var(--text-primary)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {range === 'month' ? 'Месяц' : range === 'year' ? 'Год' : 'Все время'}
              </button>
            ))}
          </div>
          
          {timeRange === 'month' && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="form-select"
                style={{ flex: 1 }}
              >
                {['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'].map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="form-select"
                style={{ flex: 1 }}
              >
                {generateYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
          
          {timeRange === 'year' && (
            <div style={{ marginBottom: '20px' }}>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="form-select"
              >
                {generateYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="section">
          <div className="section-title">
            <h2>Общая статистика</h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #34a853, #34a85322)',
              padding: '15px',
              borderRadius: '12px'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#000000',
                fontWeight: '500',
                marginBottom: '5px'
              }}>Общий доход</div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold',
                color: '#000000'
              }}>
                +{filteredTransactions.filter(t => t && t.type === 'income').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0).toLocaleString('ru-RU')} ₽
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #ea4335, #ea433522)',
              padding: '15px',
              borderRadius: '12px'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#000000',
                fontWeight: '500',
                marginBottom: '5px'
              }}>Общий расход</div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold',
                color: '#000000'
              }}>
                -{filteredTransactions.filter(t => t && t.type === 'expense').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0).toLocaleString('ru-RU')} ₽
              </div>
            </div>
            {!isMobile && (
              <div style={{
                background: 'linear-gradient(135deg, #1a73e8, #1a73e822)',
                padding: '15px',
                borderRadius: '12px'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#000000',
                  fontWeight: '500',
                  marginBottom: '5px'
                }}>Количество операций</div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: '#000000'
                }}>
                  {filteredTransactions.length}
                </div>
              </div>
            )}
          </div>
          {isMobile && (
            <div style={{
              background: 'linear-gradient(135deg, #1a73e8, #1a73e822)',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#000000',
                fontWeight: '500',
                marginBottom: '5px'
              }}>Количество операций</div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold',
                color: '#000000'
              }}>
                {filteredTransactions.length}
              </div>
            </div>
          )}
        </div>
        
        <div className="section">
          <div className="section-title">
            <h2>Расходы по категориям</h2>
          </div>
          {getExpenseData().length > 0 ? (
            <ChartComponent
              id="expense-chart"
              type="pie"
              options={expenseChartOptions}
              height="300px"
            />
          ) : (
            <div style={{ 
              height: '200px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              border: '1px dashed var(--border)',
              borderRadius: '12px'
            }}>
              Нет данных о расходах за выбранный период
            </div>
          )}
        </div>
        
        <div className="section">
          <div className="section-title">
            <h2>Доходы по категориям</h2>
          </div>
          {getIncomeData().length > 0 ? (
            <ChartComponent
              id="income-chart"
              type="pie"
              options={incomeChartOptions}
              height="300px"
            />
          ) : (
            <div style={{ 
              height: '200px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              border: '1px dashed var(--border)',
              borderRadius: '12px'
            }}>
              Нет данных о доходах за выбранный период
            </div>
          )}
        </div>
        
        <div className="section">
          <div className="section-title">
            <h2>Динамика доходов и расходов</h2>
          </div>
          {getTrendData().income.some(value => value > 0) || getTrendData().expense.some(value => value > 0) ? (
            <ChartComponent
              id="trend-chart"
              type="line"
              options={trendChartOptions}
              height="300px"
            />
          ) : (
            <div style={{ 
              height: '200px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              border: '1px dashed var(--border)',
              borderRadius: '12px'
            }}>
              Нет данных для построения графика
            </div>
          )}
        </div>
      </div>
      
      <FooterNav activePage="analytics" />
    </div>
  );

  const renderDesktopView = () => (
    <div className="desktop-card-content" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <div className="section">
        <div className="section-title">
          <h2>Финансовая аналитика</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['month', 'year', 'all'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${timeRange === range ? 'var(--primary)' : 'var(--border)'}`,
                    background: timeRange === range ? 'var(--primary)' : 'white',
                    color: timeRange === range ? 'white' : 'var(--text-primary)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {range === 'month' ? 'Месяц' : range === 'year' ? 'Год' : 'Все время'}
                </button>
              ))}
            </div>
            
            {timeRange === 'month' && (
              <div style={{ display: 'flex', gap: '5px' }}>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="form-select"
                  style={{ width: '120px', padding: '8px' }}
                >
                  {['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'].map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
                </select>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="form-select"
                  style={{ width: '100px', padding: '8px' }}
                >
                  {generateYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}
            
            {timeRange === 'year' && (
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="form-select"
                style={{ width: '100px', padding: '8px' }}
              >
                {generateYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #34a853, #34a85322)',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px', color: '#000000' }}>Общий доход</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
            +{filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()} ₽
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #ea4335, #ea433522)',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px', color: '#000000' }}>Общий расход</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
            -{filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString()} ₽
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #1a73e8, #1a73e822)',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px', color: '#000000' }}>Количество операций</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
            {filteredTransactions.length}
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '30px',
        marginBottom: '30px'
      }}>
        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Расходы по категориям</h3>
          {getExpenseData().length > 0 ? (
            <ChartComponent
              id="expense-chart-desktop"
              type="pie"
              options={{
                ...expenseChartOptions,
                legend: { ...expenseChartOptions.legend, orient: 'vertical', right: 10 }
              }}
              height="300px"
            />
          ) : (
            <div style={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              border: '1px dashed var(--border)',
              borderRadius: '12px',
              background: 'white'
            }}>
              Нет данных о расходах
            </div>
          )}
        </div>
        
        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Доходы по категориям</h3>
          {getIncomeData().length > 0 ? (
            <ChartComponent
              id="income-chart-desktop"
              type="pie"
              options={{
                ...incomeChartOptions,
                legend: { ...incomeChartOptions.legend, orient: 'vertical', right: 10 }
              }}
              height="300px"
            />
          ) : (
            <div style={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              border: '1px dashed var(--border)',
              borderRadius: '12px',
              background: 'white'
            }}>
              Нет данных о доходах
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Динамика доходов и расходов</h3>
        {getTrendData().income.some(value => value > 0) || getTrendData().expense.some(value => value > 0) ? (
          <ChartComponent
            id="trend-chart-desktop"
            type="line"
            options={trendChartOptions}
            height="400px"
          />
        ) : (
          <div style={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            border: '1px dashed var(--border)',
            borderRadius: '12px',
            background: 'white'
          }}>
            Нет данных для построения графика
          </div>
        )}
      </div>
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default AnalyticsPage;