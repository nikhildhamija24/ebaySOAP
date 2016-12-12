package ebay.cart;

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
public class cartService {
	public String addToCart(int userid, int productid, int selectquantity, double itemprice){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			
			PreparedStatement statement = conn.prepareStatement("insert into shoppingcart(userId, productId, selectedQuantity, itemprice) values (?, ?, ?, ?)");
			statement.setInt(1, userid);
			statement.setInt(2, productid);
			statement.setInt(3, selectquantity);
			statement.setDouble(4, itemprice);
			
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
			    System.out.println("Error in adding to cart");
			    obj.put("msg","couldn't add to cart");
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
	
	public String getTheCart(int userid){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			
			PreparedStatement statement = conn.prepareStatement("select * from shoppingcart INNER JOIN products ON shoppingcart.productId = products.productId WHERE " +
					"shoppingcart.userId= ? AND products.itemQuantity >= shoppingcart.selectedQuantity");
			statement.setInt(1, userid);
			
			ResultSet rs = statement.executeQuery();
			JSONArray jsarray = new JSONArray();
			JSONObject obj1 = new JSONObject();
			System.out.println(rs);
			while(rs.next()){
				
				int total_rows = rs.getMetaData().getColumnCount();
		        
		        for(int i = 0; i < total_rows; i++) {		          
					obj1.put(rs.getMetaData().getColumnLabel(i + 1).toLowerCase(), rs.getObject(i + 1));
		        }		        			    
			}
			jsarray.put(obj1);
	        obj = new JSONObject();
			obj.put("statusCode",new Integer(200));
			obj.put("msg","success");			  
		    obj.put("cart", jsarray);
		    str = obj.toString();
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
	
	public String deleteFromCart(int userid, int productid, int selectedquantity){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			PreparedStatement statement = conn.prepareStatement("delete from shoppingcart where productId=?");			
			statement.setInt(1, productid);
			
			statement.executeUpdate();
			
			statement = conn.prepareStatement("select * from shoppingcart INNER JOIN products ON shoppingcart.productId = products.productId WHERE " +
            "shoppingcart.userId= ? AND products.itemQuantity >= shoppingcart.selectedQuantity");
			
			statement.setInt(1, userid);
			ResultSet rs = statement.executeQuery();
			System.out.println(rs);
			JSONArray jsarray = new JSONArray();
			obj = new JSONObject();
			while(rs.next()){			
				int total_rows = rs.getMetaData().getColumnCount();
		        JSONObject obj1 = new JSONObject();
		        for(int i = 0; i < total_rows; i++) {		            
					obj1.put(rs.getMetaData().getColumnLabel(i + 1).toLowerCase(), rs.getObject(i + 1));					
		        }
		        jsarray.put(obj1);
			}
			obj.put("statusCode",new Integer(200));
			obj.put("msg","success");			  
		    obj.put("cart", jsarray);
			str = obj.toString();		
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
