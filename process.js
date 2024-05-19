let results = [];

function processData() {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;

    // 解析 input1 數據
    const valuesMap = input1.trim().split('\n').reduce((acc, line) => {
        const parts = line.split(/\s+/); // 使用正則表達式分割任何空白字符
        const id = parts[0];
        const value = parseFloat(parts[parts.length - 1]); // 取最後一個元素作為值
        acc[id] = value;
        return acc;
    }, {});

    // 解析 input2 數據
    const descriptionsMap = input2.trim().split('\n').reduce((acc, line) => {
        const [id, ...description] = line.split(/\s+/);
        acc[id] = description.join(' ');
        return acc;
    }, {});

    // 組合兩個映射的數據
    const donorData = {};
    Object.keys(descriptionsMap).forEach(id => {
        const description = descriptionsMap[id];
        const day = description.match(/day (\d+)/)[1];
        const donor = description.match(/Donor (\d+)/)[1];

        if (!donorData[donor]) {
            donorData[donor] = { '0': '', '2': '', '5': '', '9': '' };
        }
        donorData[donor][day] = valuesMap[id] || '';
    });

    // 生成 CSV 內容
    const days = ['0', '2', '5', '9'];
    let csvContent = 'Donor/human osteoclast day in ,' + days.join(',') + '\n';

    Object.keys(donorData).sort((a, b) => a - b).forEach(donor => {
        let row = [donor];
        days.forEach(day => {
            row.push(donorData[donor][day]);
        });
        csvContent += row.join(',') + '\n';
    });

    document.getElementById('output').textContent = csvContent;
    results = csvContent;
}

function downloadCSV() {
    const blob = new Blob([results], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ans.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
