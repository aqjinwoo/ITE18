<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index(Request $request)
    {
        $categories = Category::orderBy('category_name', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
