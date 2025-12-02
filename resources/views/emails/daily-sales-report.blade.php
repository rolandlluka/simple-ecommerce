<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
        <h2 style="color: #155724; margin-top: 0;">📊 Daily Sales Report</h2>
        <p style="margin: 0; color: #155724;">{{ $reportData['date'] }}</p>
    </div>

    <div style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 4px;">
        <p>Hello Admin,</p>
        
        <p>Here's your daily sales summary:</p>
        
        <div style="display: flex; gap: 15px; margin: 20px 0;">
            <div style="flex: 1; background-color: #f8f9fa; padding: 15px; border-radius: 4px; text-align: center;">
                <h3 style="margin: 0; color: #007bff; font-size: 32px;">{{ $reportData['totalOrders'] }}</h3>
                <p style="margin: 5px 0 0 0; color: #6c757d;">Total Orders</p>
            </div>
            <div style="flex: 1; background-color: #f8f9fa; padding: 15px; border-radius: 4px; text-align: center;">
                <h3 style="margin: 0; color: #28a745; font-size: 32px;">${{ number_format($reportData['totalRevenue'], 2) }}</h3>
                <p style="margin: 5px 0 0 0; color: #6c757d;">Total Revenue</p>
            </div>
        </div>

        @if($reportData['productsSold']->isNotEmpty())
        <div style="margin-top: 30px;">
            <h3 style="color: #495057;">Products Sold Today</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($reportData['productsSold'] as $product)
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">{{ $product->name }}</td>
                        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #dee2e6;">{{ $product->total_quantity }}</td>
                        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #dee2e6;">${{ number_format($product->total_revenue, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @else
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">No sales were recorded today.</p>
        </div>
        @endif
        
        <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>E-Commerce System</strong>
        </p>
    </div>

    <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 4px; font-size: 12px; color: #6c757d; text-align: center;">
        <p style="margin: 0;">This is an automated daily report from your e-commerce system.</p>
    </div>
</body>
</html>

