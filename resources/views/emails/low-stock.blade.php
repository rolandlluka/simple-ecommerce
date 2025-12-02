<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Low Stock Alert</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
        <h2 style="color: #721c24; margin-top: 0;">⚠️ Low Stock Alert</h2>
    </div>

    <div style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 4px;">
        <p>Hello Admin,</p>
        
        <p>The following product is running low on stock:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc3545;">{{ $product->name }}</h3>
            <p style="margin: 5px 0;"><strong>Current Stock:</strong> {{ $product->stock_quantity }} units</p>
            <p style="margin: 5px 0;"><strong>Price:</strong> ${{ number_format($product->price, 2) }}</p>
            @if($product->description)
            <p style="margin: 5px 0;"><strong>Description:</strong> {{ $product->description }}</p>
            @endif
        </div>

        <p>Please consider restocking this product to avoid running out.</p>
        
        <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>E-Commerce System</strong>
        </p>
    </div>

    <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 4px; font-size: 12px; color: #6c757d; text-align: center;">
        <p style="margin: 0;">This is an automated notification from your e-commerce system.</p>
    </div>
</body>
</html>

