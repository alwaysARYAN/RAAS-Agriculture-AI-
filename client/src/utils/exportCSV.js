// Simple CSV Export - Always works!

export const exportFarmsToCSV = (farms, userName) => {
  try {
    // Create CSV content
    let csv = 'Farm Report\n';
    csv += `Generated for: ${userName || 'User'}\n`;
    csv += `Date: ${new Date().toLocaleDateString()}\n`;
    csv += `Total Farms: ${farms.length}\n\n`;
    
    // Headers
    csv += 'Farm Name,State,District,Village,Area (acres),Soil Type,Irrigation,Water Source\n';
    
    // Data rows
    farms.forEach(farm => {
      csv += `"${farm.farmName || 'N/A'}",`;
      csv += `"${farm.location?.state || 'N/A'}",`;
      csv += `"${farm.location?.district || 'N/A'}",`;
      csv += `"${farm.location?.village || '-'}",`;
      csv += `${farm.area || 0},`;
      csv += `"${farm.soil_type || 'N/A'}",`;
      csv += `"${farm.irrigation_type || 'N/A'}",`;
      csv += `"${farm.water_source || 'N/A'}"\n`;
    });
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Farms_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Export error:', error);
    return false;
  }
};

export const exportCropsToCSV = (crops, userName) => {
  try {
    let csv = 'Crop Report\n';
    csv += `Generated for: ${userName || 'User'}\n`;
    csv += `Date: ${new Date().toLocaleDateString()}\n`;
    csv += `Total Crops: ${crops.length}\n\n`;
    
    csv += 'Crop Name,Farm,Season,Stage,Health,Planting Date\n';
    
    crops.forEach(crop => {
      csv += `"${crop.crop_name || 'N/A'}",`;
      csv += `"${crop.farm_id?.farmName || crop.farm_id?.name || 'N/A'}",`;
      csv += `"${crop.season || 'N/A'}",`;
      csv += `"${crop.stage || 'N/A'}",`;
      csv += `"${crop.health_status || 'Unknown'}",`;
      csv += `"${crop.planting_date ? new Date(crop.planting_date).toLocaleDateString() : 'N/A'}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Crops_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Export error:', error);
    return false;
  }
};
