package paymentService;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.jws.WebService;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@WebService
public class validatePayment {
	public String payment(int userid){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			
			PreparedStatement statement = conn.prepareStatement("insert into userhistorydata(productId,itemName,itemDescription,sellerName," +
                "transactionType,quantity,itemPrice,userEmail,userid,postingDate) select products.productId,itemName," +
                "itemDescription,sellerName,\'bought\',selectedQuantity,itemPrice,ebaysignup.email," +
                "ebaysignup.userid,postingDate from products  INNER JOIN shoppingcart ON products.productId = shoppingcart.productId" +
                " INNER JOIN ebaysignup ON shoppingcart.userId = ebaysignup.userid where products.itemQuantity >= shoppingcart.selectedQuantity");
			
			statement.executeUpdate();
			
			statement = conn.prepareStatement("update products inner join shoppingcart on shoppingcart.productId=" +
                        "products.productId set products.itemQuantity = products.itemQuantity - shoppingcart.selectedQuantity" +
                        " where shoppingcart.selectedQuantity <= products.itemQuantity and shoppingCart.userId=?");
			
			statement.setInt(1, userid);
			
			statement.executeUpdate();
			
			statement = conn.prepareStatement("delete from shoppingcart where userId = ?");
			statement.setInt(1, userid);
			
			statement.executeUpdate();
			
			statement = conn.prepareStatement("delete from products where itemQuantity = 0");
			
			int rs = statement.executeUpdate();
			if(rs == 1){
//				JSONArray jsonArray = new JSONArray();
				obj = new JSONObject();
			    obj.put("statusCode",new Integer(200));
			    obj.put("msg","success");				  
			    str= obj.toString();
			}else{
				obj = new JSONObject();
			    obj.put("statusCode",new Integer(401));
			    System.out.println("Error in product payment");
			    obj.put("msg","couldn't finish the payment");
			    str= obj.toString();
			}
		}
		catch(ClassNotFoundException e) {
			e.printStackTrace();
		} catch(SQLException e) {
			e.printStackTrace();
		} catch(JSONException e){
			e.printStackTrace();
		}
		return str;
	}
}
