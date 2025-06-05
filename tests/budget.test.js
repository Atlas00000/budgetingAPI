import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000/v1';

async function testBudgetAPI() {
    console.log('🧪 Starting Budget API Tests...\n');

    try {
        // Fetch categories first
        console.log('Fetching categories...');
        const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
        const categories = await categoriesResponse.json();
        console.log('Categories:', categories);
        
        // Use the first category ID if available, otherwise use null
        const categoryId = categories && categories.length > 0 ? categories[0].id : null;
        console.log('Using category ID:', categoryId);

        // Test 1: Create a new budget
        console.log('\nTest 1: Creating a new budget...');
        const createResponse = await fetch(`${API_BASE_URL}/budgets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryId,
                month: 6,
                year: 2024,
                amount: 1000
            })
        });

        const createData = await createResponse.json();
        console.log('Create Response:', createData);
        console.log('Status:', createResponse.status);
        console.log('✅ Create test completed\n');

        if (!createResponse.ok) {
            throw new Error('Failed to create budget');
        }

        const budgetId = createData.id;

        // Test 2: Get all budgets
        console.log('Test 2: Getting all budgets...');
        const getAllResponse = await fetch(`${API_BASE_URL}/budgets`);
        const getAllData = await getAllResponse.json();
        console.log('Get All Response:', getAllData);
        console.log('Status:', getAllResponse.status);
        console.log('✅ Get all test completed\n');

        // Test 3: Get budget by ID
        console.log('Test 3: Getting budget by ID...');
        const getByIdResponse = await fetch(`${API_BASE_URL}/budgets/${budgetId}`);
        const getByIdData = await getByIdResponse.json();
        console.log('Get By ID Response:', getByIdData);
        console.log('Status:', getByIdResponse.status);
        console.log('✅ Get by ID test completed\n');

        // Test 4: Update budget
        console.log('Test 4: Updating budget...');
        const updateResponse = await fetch(`${API_BASE_URL}/budgets/${budgetId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryId,
                month: 6,
                year: 2024,
                amount: 1500
            })
        });

        const updateData = await updateResponse.json();
        console.log('Update Response:', updateData);
        console.log('Status:', updateResponse.status);
        console.log('✅ Update test completed\n');

        // Test 5: Get budget status
        console.log('Test 5: Getting budget status...');
        const statusResponse = await fetch(`${API_BASE_URL}/budgets/status?month=6&year=2024`);
        const statusData = await statusResponse.json();
        console.log('Status Response:', statusData);
        console.log('Status:', statusResponse.status);
        console.log('✅ Get status test completed\n');

        // Test 6: Delete budget
        console.log('Test 6: Deleting budget...');
        const deleteResponse = await fetch(`${API_BASE_URL}/budgets/${budgetId}`, {
            method: 'DELETE'
        });
        console.log('Delete Status:', deleteResponse.status);
        console.log('✅ Delete test completed\n');

        console.log('🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run the tests
testBudgetAPI(); 