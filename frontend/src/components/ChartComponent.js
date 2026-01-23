import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ChartComponent = ({ id, type, options, height = '300px' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      
      echarts.registerTheme('moneycontrol', {
        color: ['#1a73e8', '#4285f4', '#34a853', '#ea4335', '#fbbc05', '#ab47bc', '#00acc1', '#ff7043']
      });
      
      chartInstance.current.setOption(options);
    }

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [options, type]);

  return (
    <div 
      ref={chartRef} 
      id={id} 
      style={{ 
        width: '100%', 
        height: height,
        minHeight: '200px'
      }} 
    />
  );
};

export default ChartComponent;